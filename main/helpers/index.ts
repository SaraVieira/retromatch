import axios, { all } from "axios";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";
import { transformResponse } from "./response-transform";

export * from "./create-window";

const allowedInLetsPlay = [
  {
    name: "nes",
    id: 3,
  },
  {
    name: "snes",
    id: 4,
  },
  {
    name: "gb",
    id: 9,
  },
  {
    name: "gbc",
    id: 10,
  },
  {
    name: "gba",
    id: 12,
  },
  {
    name: "n64",
    id: 14,
  },
  {
    name: "md",
    id: 1,
  },
  {
    name: "gg",
    id: 21,
  },
  {
    name: "ms",
    id: 2,
  },
  {
    name: "pce",
    id: 31,
  },
  {
    name: "ps1",
    id: 57,
  },
  {
    name: "sega32",
    id: 19,
  },
  {
    name: "vb",
    id: 11,
  },
  {
    name: "sat",
    id: 22,
  },
  {
    name: "neo",
    id: 142,
  },
  {
    name: "gcn",
    id: 13,
  },
  {
    name: "atari2600",
    id: 26,
  },
  {
    name: "panasonic3DO",
    id: 29,
  },
  {
    name: "cdi",
    id: 133,
  },
  {
    name: "jaguar",
    id: 27,
  },
  {
    name: "ngp",
    id: 25,
  },
  {
    name: "lynx",
    id: 28,
  },
];

export const createID = () => {
  const lowercaseRandomString = customAlphabet(alphanumeric, 10);

  return `a${lowercaseRandomString()}`;
};

export const scrapeGame = async (file: any, scraping_id: number) => {
  if (scraping_id === 75) {
    const response = await axios(
      `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
    ).then((rsp) => rsp.data);
    if (response.result[0]) {
      return transformResponse(response.result[0], "arcadeDB");
    }
  }

  if (allowedInLetsPlay.map((a) => a.id).includes(scraping_id)) {
    const normalizedName = file.name.replaceAll(/\s*\(.*?\)/gi, "");
    const response = await axios(
      `https://letsplayretro.games/api/scrape?query=${encodeURI(
        normalizedName
      )}&console=${allowedInLetsPlay.find((c) => c.id === scraping_id).name}`
    ).then((rsp) => rsp.data);
    if (response) {
      return transformResponse(response, "letsplay");
    }
  }
};
