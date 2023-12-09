import Store from "electron-store";
import { RomFolders, Roms } from "../../types";

export const foldersStore = new Store<RomFolders[]>({
  name: "foldersStore",
});

export const romsStore = new Store<Roms[]>({
  name: "roms",
});
