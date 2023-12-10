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

export type FileInfo = {
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
  files: string[];
};

export type RomFolders = {
  [id: string]: RomFolder;
};

export type Roms = {
  [id: string]: {
    id?: string;
    isDuplicate?: Boolean;
    name: string;
    extension: string;
    fullName: string;
    info?: FileInfo;
    size: number;
  };
};
