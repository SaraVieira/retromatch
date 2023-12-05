import axios from 'axios';
import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

export * from "./create-window";

const allowedInLetsPlay = {
  nes: 3,
  snes: 4,
  gb: 9,
  gbc: 10,
  gba: 12,
  n64: 14,
  md: 1,
  gg: 21,
  ms: 2,
  pce: 31,
  ps1: 57,
  sega32: 19,
  vb: 11,
  sat: 22,
  neo: 142,
  gcn: 13,
  atari2600: 26,
  panasonic3DO: 29,
  cdi: 133,
  jaguar: 27,
  ngp: 25,
  lynx: 28,
};

const transformConsoleResponse = (data: any) => {
  return {
    url: data.url,
    title: data.name,
    developer: {
      name: "",
    },
    images: {
      screenshot: data.screenshots.length > 0 ? data.screenshots[0] : undefined,
      title: data.screenshots.length > 0 ? data.screenshots[0] : undefined,
      cover: data.cover.url,
    },
    genre: "",
    players: "",
    released: data.first_release_date,
    videos: {
      youtube: data.youtube_video_id,
      shortplay: data.url_video_shortplay,
    },
    languages:
      typeof data.languages === "string"
        ? [data.languages]
        : [...(data.languages || [])],
    rating: data.total_rating,
    series: data.franchise?.name,
  };
};

const transformResponse = (data: any, type: string) => {
  if (!data) return null;
  if (type === "arcadeDB") {
    return {
      url: data.url,
      title: data.short_title || data.title,
      developer: {
        name: data.manufacturer,
      },
      images: {
        screenshot: data.url_image_ingame,
        title: data.url_image_title,
        cover: data.url_image_flyer,
      },
      genre: data.genre,
      players: data.players,
      released: data.year,
      videos: {
        youtube: data.youtube_video_id,
        shortplay: data.url_video_shortplay,
      },
      languages:
        typeof data.languages === "string"
          ? [data.languages]
          : [...(data.languages || [])],
      rating: data.rate,
      series: data.series,
    };
  }
};

export const createID = () => {
  const lowercaseRandomString = customAlphabet(alphanumeric, 10);

  return `a${lowercaseRandomString()}`;
};

export const scrapeGame = async (
  file: any,
  consoleId: string,
  isArcade: bool
) => {
  const normalizedName = encodeURI(file.name.replaceAll(/\s*\(.*?\)/gi, ""));
  if (isArcade) {
    const response = await axios(
      `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${normalizedName}`
    ).then((rsp) => rsp.data);
    if (response.result[0]) {
      return transformResponse(response.result[0], "arcadeDB");
    }
  } else {
    const response = await axios(
      `https://letsplayretro.games/api/scrape?query=${normalizedName}&console=${consoleId}`
    ).then((rsp) => rsp.data);
    if (response) {
      return transformConsoleResponse(response);
    }
  }
};
