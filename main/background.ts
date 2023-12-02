import path, { basename, extname } from "path";
import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import Store from "electron-store";
import { createWindow } from "./helpers";
import { RomFolder, RomFolders } from "../types";
import { readdir } from "fs/promises";
import { consoles } from "../consoles";
import { readdirSync, statSync } from "fs";
import { calculateMD5Hash, calculateSha1Hash } from "./helpers/hashes";
import { getFolders } from "./helpers/folders";

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
    const allFolders = getFolders(path);

    const currentFolder = {
      ...(romFolders.get(path) as RomFolder),
      folders: allFolders,
      lastSynced: new Date(),
    };

    romFolders.set(path, currentFolder);
    event.reply("new_current_folder", currentFolder);
  });
  romFolders.clear();

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
