import path, { extname } from "path";
import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import Store from "electron-store";
import { createWindow } from "./helpers";
import { RomFolder, RomFolders } from "../types";
import { readdir } from "fs/promises";
import { consoles } from "../consoles";
import { readdirSync } from "fs";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  const romFolders = new Store<RomFolders[]>({
    name: "romFolders",
  });

  ipcMain.on("load", async (event) =>
    event.reply("all_data", Object.values(romFolders.store))
  );

  ipcMain.on("add_folder", async (event, folder: RomFolder) => {
    romFolders.set(folder.path, folder);
  });

  ipcMain.on("sync_folder", async (event, path: string) => {
    console.log("here");
    const allFolders = readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
      .filter((dir) =>
        consoles
          .map((a) => a.folderNames)
          .flat()
          .includes(dir.name)
      )
      .map((folder) => ({
        path: `${path}/${folder.name}`,
        console: consoles.find((c) =>
          c.folderNames.includes(folder.name.toLocaleLowerCase())
        ),
      }))
      .map((folder) => {
        const files = readdirSync(folder.path).filter((file) =>
          folder.console.extensions.includes(extname(file.toLocaleLowerCase()))
        );
        return {
          ...folder,
          files: files,
        };
      });
    const currentFolder = {
      ...(romFolders.get(path) as RomFolder),
      folders: allFolders,
      lastSynced: new Date(),
    };

    romFolders.set(path, currentFolder);
    event.reply("new_current_folder", currentFolder);
  });
  // romFolders.clear();

  ipcMain.on("open-dialog-folder", (event) => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });

    event.reply("folder_path", path[0]);
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
