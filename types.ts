export type RomFolder = {
  path: string;
  name: string;
  configFilePath: string;
  lastSynced?: Date;
  folders?: Folder[];
};

export type Folder = {
  path: string;
  console: {
    name: string;
    folderNames: string[];
    extensions: string[];
    id: string;
    screenscrapper_id: number;
    image: string;
  };
  files: {
    name: string;
    extension: string;
    fullName: string;
    info?: any;
    size: number;
  }[];
};

export type RomFolders = RomFolder[];
