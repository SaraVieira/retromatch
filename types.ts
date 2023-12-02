export type RomFolder = {
  path: string;
  name: string;
  configFilePath: string;
  lastSynced?: Date;
  folders?: {
    path: string;
    console: {
      name: string;
      folderNames: string[];
      extensions: string[];
      id: string;
      screenscrapper_id: string;
      image: string;
    };
    files: {
      name: string;
      extension: string;
      full_name: string;
      info?: any;
      size: number;
    }[];
  }[];
};

export type RomFolders = RomFolder[];
