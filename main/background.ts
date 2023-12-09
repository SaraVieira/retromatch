import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";

import path from "path";

import { RomFolder } from "../types";
import { createWindow, scrapeGame } from "./helpers";
import { getFolders } from "./helpers/folders";
import { getRoms } from "./helpers/roms";
import { foldersStore, romsStore } from "./helpers/stores";

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

  ipcMain.on("load", async (event) => {
    event.reply("all_data", foldersStore.store);
    event.reply("all_roms", romsStore.store);
  });

  ipcMain.on("add_folder", async (_, folder: RomFolder) => {
    foldersStore.set(folder.id, folder);
  });

  ipcMain.on(
    "sync_folder",
    async (event, { path, id }: { path: string; id: string }) => {
      const allFolders = await getFolders(path);
      const currentFolder = {
        ...(foldersStore.get(id) as RomFolder),
        folders: allFolders,
        lastSynced: new Date(),
      };

      foldersStore.set(id, currentFolder);
      await getRoms({ allFolders, id });
      event.reply("done_syncing", foldersStore.get(id));
    }
  );

  ipcMain.on("scrape_folder", async (event, { folder, all }) => {
    const filesToScrape = folder.files;

    try {
      await Promise.all(
        filesToScrape.map(async (file) => {
          if (!all && romsStore.get(file).info) return;
          try {
            const gameInfo = await scrapeGame(
              romsStore.get(file),
              folder.console.screenscrapper_id
            );
            if (gameInfo) {
              romsStore.set(`${file}.info`, gameInfo);
              event.reply("new_data", romsStore.get(file));
            }
          } catch (e) {
            console.log(e.message);
          }
        })
      );
    } catch (e) {
      console.log(e.message);
    }
  });
  // foldersStore.clear();
  // romsStore.clear();

  ipcMain.on("open-dialog-folder", (event) => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"],
    });

    if (path) {
      event.reply("folder_path", path[0]);
    }
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
