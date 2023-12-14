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
  released: string;
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
    isDuplicate?: boolean;
    name: string;
    extension: string;
    fullName: string;
    info?: FileInfo;
    size: number;
  };
};

export interface HLTGame {
  id?: string;
  state: string;
  count: number;
  game_id: number;
  game_name: string;
  game_name_date: number;
  game_alias: string;
  game_type: string;
  game_image: string;
  comp_lvl_combine: number;
  comp_lvl_sp: number;
  comp_lvl_co: number;
  comp_lvl_mp: number;
  comp_lvl_spd: number;
  comp_main: number;
  comp_plus: number;
  comp_100: number;
  comp_all: number;
  comp_main_count: number;
  comp_plus_count: number;
  comp_100_count: number;
  comp_all_count: number;
  invested_co: number;
  invested_mp: number;
  invested_co_count: number;
  invested_mp_count: number;
  count_comp: number;
  count_speedrun: number;
  count_backlog: number;
  count_review: number;
  review_score: number;
  count_playing: number;
  count_retired: number;
  profile_dev: string;
  profile_popular: number;
  profile_steam: number;
  profile_platform: string;
  release_world: number;
  name: string;
  image: string;
  value: string;
}

export type Backlog = {
  state: "backlog" | "in_progress" | "done";
  game: HLTGame;
};
