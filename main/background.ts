import { app, dialog, ipcMain, shell } from "electron";
import serve from "electron-serve";
import path from "path";
import { createWindow } from "./helpers";
import { foldersStore, initFolderActions } from "./stores/folders";
import { backlogStore, initBacklogState } from "./stores/backlog";
import { initSettingsActions, settingsStore } from "./stores/settings";
import { initRomActions, romsStore } from "./stores/roms";
import "dotenv/config";
import { existsSync } from "fs";

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

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on("load", async (event) => {
    Object.values(foldersStore.store).map((folder) => {
      foldersStore.set(
        `${folder.id}.connected`,
        existsSync(folder.path as unknown as string)
      );
    });

    event.reply("all_data", foldersStore.store);
    event.reply("all_roms", romsStore.store);
    event.reply("all_backlog", Object.values(backlogStore.store));
    event.reply("all_settings", settingsStore.store);
  });
  initRomActions();
  initFolderActions();
  initBacklogState();
  initSettingsActions(mainWindow);

  ipcMain.on("open-dialog-folder", (event) => {
    const path = dialog.showOpenDialogSync(mainWindow, {
      properties: ["openDirectory"]
    });

    if (path) {
      event.reply("folder_path", path[0]);
    }
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
