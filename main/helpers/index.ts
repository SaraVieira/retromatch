import axios from "axios";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";
import { transformResponse } from "./response-transform";
import { allowedInLetsPlay } from "./constants";

export * from "./create-window";

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
      // wait because prisma cries if we don't
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return transformResponse(response, "letsplay");
    }
  }
};
