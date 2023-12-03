export type RomFolder = {
  id: string;
  path: string;
  name: string;
  configFilePath: string;
  lastSynced?: Date;
  folders?: {
    [id: string]: Folder;
  };
};

type FileInfo = {
  url: string;
  title: string;
  developer: {
    name: string;
  };
  images: {
    screenshot: string;
    title: string;
    cover: string;
  };
  genre: string;
  players: number;
  releases: string;
  videos: {
    youtube: string;
    shortplay: string;
  };
  languages: string[];
  rating: number;
  series: string;
};

export type Folder = {
  id?: string;
  path: string;
  console: {
    name: string;
    folderNames: string[];
    extensions: string[];
    id?: string;
    screenscrapper_id: number;
    image: string;
  };
  files: {
    [id: string]: {
      id?: string;
      name: string;
      extension: string;
      fullName: string;
      info?: any;
      size: number;
    };
  };
};

export type RomFolders = {
  [id: string]: RomFolder;
};
