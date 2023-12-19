import Store from "electron-store";
import { RomFolder, RomFolders } from "../../types";
import { ipcMain } from "electron";
import { readdir } from "fs/promises";
import { consoles } from "../../consoles";
import { romsStore } from "./roms";
import { getRoms } from "../helpers/roms";
import checkDiskSpace from "check-disk-space";
import { getFolders } from "../helpers/folders";

export const foldersStore = new Store<RomFolders[]>({
  name: "foldersStore"
});

export const initFolderActions = () => {
  ipcMain.on("delete_folder", async (_, id: keyof RomFolders[]) =>
    foldersStore.delete(id)
  );

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

  ipcMain.on(
    "sync_folder",
    async (
      event,
      { folders, mainFolder }: { folders: any[]; mainFolder: RomFolder }
    ) => {
      const { size } = await checkDiskSpace(mainFolder.path);
      const allFolders = await getFolders(folders);
      const currentFolder = {
        ...mainFolder,
        folders: allFolders,
        lastSynced: new Date(),
        space: size
      };

      foldersStore.set(mainFolder.id, currentFolder);
      await getRoms({ allFolders, id: mainFolder.id });
      event.reply("done_syncing", {
        newFolder: foldersStore.get(mainFolder.id),
        roms: romsStore.store
      });
    }
  );
};
