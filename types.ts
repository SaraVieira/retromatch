export type RomFolder = {
  path: string;
  name: string;
  console: string;
  configFilePath: string;
  lastSynced?: Date;
  folders?: {
    path: string;
    console: {
      name: string;
      folderNames: string[];
      extensions: string[];
      id: string;
    };
    files: string[];
  }[];
};

export type RomFolders = RomFolder[];
