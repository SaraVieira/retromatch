export type RomFolder = {
  path: string;
  name: string;
  folderStyle?: "emulationStation" | "miyoo";
  console: string;
  configFilePath: string;
};

export type RomFolders = RomFolder[];
