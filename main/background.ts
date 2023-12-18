import { app, dialog, ipcMain } from "electron";
import serve from "electron-serve";
import path from "path";
import { createWindow } from "./helpers";
import { foldersStore, initFolderActions } from "./stores/folders";
import { backlogStore, initBacklogState } from "./stores/backlog";
import { initSettingsActions } from "./stores/settings";
import { romsStore } from "./stores/roms";

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
