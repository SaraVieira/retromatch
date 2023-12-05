import {
  app,
  dialog,
  ipcMain,
} from 'electron';
import serve from 'electron-serve';
import Store from 'electron-store';
import path from 'path';

import {
  Folder,
  RomFolder,
  RomFolders,
} from '../types';
import {
  createWindow,
  scrapeGame,
} from './helpers';
import { getFolders } from './helpers/folders';

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
    event.reply("all_data", romFolders.store)
  );

  ipcMain.on("add_folder", async (_, folder: RomFolder) => {
    romFolders.set(folder.id, folder);
  });

  ipcMain.on(
    "sync_folder",
    async (event, { path, id }: { path: string; id: string }) => {
      const allFolders = await getFolders(path);
      const currentFolder = {
        ...(romFolders.get(id) as RomFolder),
        folders: allFolders,
        lastSynced: new Date(),
      };

      romFolders.set(id, currentFolder);
      event.reply("done_syncing", currentFolder);
    }
  );

  ipcMain.on(
    "scrape_folder",
    async (
      event,
      { folder, mainFolder }: { folder: Folder; mainFolder: RomFolder }
    ) => {
      // use arcade db
      try {
        await Promise.all(
          Object.values(folder.files).map(async (file) => {
            const gameInfo = await scrapeGame(file, folder.console.id, folder.console.screenscrapper_id === 75);

            if (gameInfo) {
              romFolders.set(
                `${mainFolder.id}.folders.${folder.id}.files.${file.id}.info`,
                gameInfo
              );
              event.reply("new_data", romFolders.get(mainFolder.id));
            }
          })
        );
      } catch (e) {
        console.log(e);
      }
    }
  );
  romFolders.clear();

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
