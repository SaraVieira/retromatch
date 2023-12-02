import path from "path";
import { app, dialog, ipcMain } from "electron";

import serve from "electron-serve";
import Store from "electron-store";
import { createWindow, transformResponse } from "./helpers";
import { Folder, RomFolder, RomFolders } from "../types";
import { getFolders } from "./helpers/folders";
import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

function escapePath(path) {
  if (typeof path !== "string") {
    throw new TypeError("Expected a string");
  }

  return path.replace(/[\\.[]/g, "\\$&");
}

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
    accessPropertiesByDotNotation: false,
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

  ipcMain.on(
    "scrape_folder",
    async (event, { folder, path }: { folder: Folder; path: string }) => {
      // use arcade db
      try {
        if (folder.console.screenscrapper_id === 75) {
          await Promise.all(
            folder.files.map(async (file) => {
              const response = await axios(
                `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
              ).then((rsp) => rsp.data);

              if (response.result[0]) {
                const cleanResponse = transformResponse(
                  response.result[0],
                  "arcadeDB"
                );
                const currentPathStore = romFolders.get(path) as RomFolder;
                const str = `${path}.folders`;
                console.log(romFolders.get(str));
                romFolders.set(str, cleanResponse);
                event.reply("new_data", romFolders.get(path));
              }
            })
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  );
  //romFolders.clear();

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
