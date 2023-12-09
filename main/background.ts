import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import Store from "electron-store";
import path, { extname } from "path";
import { readdir, stat } from "fs/promises";
import { v5 as uuidv5 } from "uuid";

import { RomFolder, RomFolders, Roms } from "../types";
import { createID, createWindow, scrapeGame } from "./helpers";
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

  const foldersStore = new Store<RomFolders[]>({
    name: "foldersStore",
  });

  const romsStore = new Store<Roms[]>({
    name: "roms",
  });

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
      try {
        await Promise.all(
          Object.values(allFolders).map(async (folder) => {
            return await Promise.all(
              (
                await readdir(folder.path, { withFileTypes: true })
              )
                .filter(
                  (dirent) => dirent.isFile() && !dirent.name.startsWith(".")
                )
                .filter((file) =>
                  folder.console.extensions.includes(
                    extname(file.name.toLocaleLowerCase())
                  )
                )
                .map(async (file) => {
                  const size = (await stat(`${folder.path}/${file.name}`)).size;

                  const newFile = {
                    name: file.name.split(extname(file.name))[0],
                    extension: extname(file.name),
                    fullName: file.name,
                    size,
                  };
                  const fileId = uuidv5(
                    `${newFile.fullName}${newFile.size}`,
                    uuidv5.URL
                  );
                  foldersStore.set(`${id}.folders.${folder.id}.files`, [
                    ...((foldersStore.get(`${id}.folders.${folder.id}.files`) ||
                      []) as any[]),
                    fileId,
                  ]);
                  if (romsStore.get(fileId)) {
                    romsStore.set(fileId, {
                      ...newFile,
                      id: fileId,
                    });
                  }
                })
            );
          })
        );
        event.reply("done_syncing", foldersStore.get(id));
      } catch (e) {
        console.log(e);
      }
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
