import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";

import path from "path";

import { Backlog, RomFolder } from "../types";
import { createWindow, scrapeGame } from "./helpers";
import { getFolders } from "./helpers/folders";
import { getRoms } from "./helpers/roms";
import { backlogStore, foldersStore, romsStore } from "./helpers/stores";
import { readdir } from "fs/promises";
import { consoles } from "../consoles";
import { readFileSync, writeFileSync } from "fs";

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
      preload: path.join(__dirname, "preload.js")
    }
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
    event.reply("all_backlog", Object.values(backlogStore.store));
  });

  ipcMain.on("add_folder", async (event, folder: RomFolder) => {
    const pathRead = (await readdir(folder.path, { withFileTypes: true }))
      .filter((f) => f.isDirectory() && !f.name.startsWith("."))
      .map((dir) => ({
        ...dir,
        console: consoles.find((c) =>
          c.folderNames.includes(dir.name.toLocaleLowerCase())
        )
      }));
    event.reply("folders_found", pathRead);
  });

  ipcMain.on("add_to_backlog", async (_, game: Backlog) => {
    backlogStore.set(game.id, game);
  });

  ipcMain.on("remove_from_backlog", async (_, id: string) => {
    backlogStore.delete(id);
  });

  ipcMain.on(
    "change_backlog_state",
    async (_, { id, newState }: { id: string; newState: Backlog["state"] }) => {
      backlogStore.set(id, {
        ...backlogStore.get(id),
        state: newState
      });
    }
  );

  ipcMain.on(
    "sync_folder",
    async (
      event,
      { folders, mainFolder }: { folders: any[]; mainFolder: RomFolder }
    ) => {
      const allFolders = await getFolders(folders);
      const currentFolder = {
        ...mainFolder,
        folders: allFolders,
        lastSynced: new Date()
      };

      foldersStore.set(mainFolder.id, currentFolder);
      await getRoms({ allFolders, id: mainFolder.id });
      event.reply("done_syncing", {
        newFolder: foldersStore.get(mainFolder.id),
        roms: romsStore.store
      });
    }
  );

  ipcMain.on("scrape_folder", async (event, { folder, all }) => {
    const filesToScrape = all
      ? folder.files
      : folder.files.filter((file) => !romsStore.get(file).info);
    let scrapped = 0;
    console.log(filesToScrape);
    try {
      await Promise.all(
        filesToScrape.map(async (file) => {
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
          } finally {
            scrapped = scrapped + 1;
            event.reply("scrapping", {
              current: scrapped,
              total: filesToScrape.length
            });
          }
        })
      );
    } catch (e) {
      console.log(e.message);
    }
  });

  ipcMain.on("clear-cache", (event) => {
    foldersStore.clear();
    romsStore.clear();

    event.reply("done-cache-clear");
  });

  ipcMain.on("open-dialog-folder", (event) => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"]
    });

    if (path) {
      event.reply("folder_path", path[0]);
    }
  });

  ipcMain.on("import-data", (event) => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "JSON files", extensions: ["json"] }]
    });

    if (path) {
      const fileContents = JSON.parse(
        readFileSync(path[0], { encoding: "utf-8" })
      );
      if (!fileContents.roms || !fileContents.folders) return;
      romsStore.store = fileContents.roms;
      foldersStore.store = fileContents.folders;

      event.reply("imported");
    }
  });

  ipcMain.on("export-data", async (event) => {
    const path = await dialog.showSaveDialog(mainWindow, {
      defaultPath: "retromatch-export.json",
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });

    if (path?.filePath) {
      writeFileSync(
        path.filePath,
        JSON.stringify({
          roms: romsStore.store,
          folders: foldersStore.store
        })
      );
      event.reply("exported");
    }
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
