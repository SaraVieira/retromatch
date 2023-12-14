import Store from "electron-store";
import { Backlog, RomFolders, Roms } from "../../types";

export const foldersStore = new Store<RomFolders[]>({
  name: "foldersStore"
});

export const romsStore = new Store<Roms[]>({
  name: "roms"
});

export const backlogStore = new Store<{
  [id: string]: Backlog;
}>({
  name: "backlog"
});
