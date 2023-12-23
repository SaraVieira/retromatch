import { dialog, ipcMain } from "electron";
import { foldersStore } from "./folders";
import { romsStore } from "./roms";
import { backlogStore } from "./backlog";
import { readFileSync, writeFileSync } from "fs";
import { omit } from "lodash";

export const initSettingsActions = (
  mainWindow: Electron.CrossProcessExports.BrowserWindow
) => {
  ipcMain.on("clear-cache", (event) => {
    foldersStore.clear();
    romsStore.clear();
    backlogStore.clear();

    event.reply("done-cache-clear");
  });

  ipcMain.on("clear-info-cache", (event) => {
    const newWithNoInfo = Object.values(romsStore.store).map((r) =>
      omit(r, "info")
    );
    romsStore.store = newWithNoInfo.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
    event.reply("done-cache-clear");
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
      if (fileContents.backlog) {
        backlogStore.store = fileContents.backlog;
      }

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
          folders: foldersStore.store,
          backlog: backlogStore.store
        })
      );
      event.reply("exported");
    }
  });
};
