import axios from 'axios';
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
  transformConsoleResponse,
  transformResponse,
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
        if (folder.console.screenscrapper_id === 75) {
          await Promise.all(
            Object.values(folder.files).map(async (file) => {
              const response = await axios(
                `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
              ).then((rsp) => rsp.data);

              if (response.result[0]) {
                const cleanResponse = transformResponse(
                  response.result[0],
                  "arcadeDB"
                );

                romFolders.set(
                  `${mainFolder.id}.folders.${folder.id}.files.${file.id}.info`,
                  cleanResponse
                );
                event.reply("new_data", romFolders.get(mainFolder.id));
              }
            })
          );
        }
        else {
          await Promise.all(
            Object.values(folder.files).map(async (file) => {
              const normalizedName = file.name.replaceAll(/\s*\(.*?\)/ig, "")
              const response = await axios(
                `https://letsplayretro.games/api/scrape?query=${encodeURI(normalizedName)}&console=${folder.console.id}`
              ).then((rsp) => rsp.data);
              if (response) {
                const cleanResponse = transformConsoleResponse(
                  response
                );

                romFolders.set(
                  `${mainFolder.id}.folders.${folder.id}.files.${file.id}.info`,
                  cleanResponse
                );
                event.reply("new_data", romFolders.get(mainFolder.id));
              }
            })
         )
        }
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
