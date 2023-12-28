import axios from "axios";
import axiosRetry from "axios-retry";
import { allowedInLetsPlay } from "../constants";
import { transformResponse } from "./response-transform";
import { settingsStore } from "../../stores/settings";
import { letsPlayGames } from "../../data";
import Fuse from "fuse.js";
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

const workerUrl = "https://retromatch-game-info.nikkitaftw.workers.dev/scrape";

export const scrapeGame = async (file: any, scraping_id: number) => {
  const gameInfo = await retrieveGameInfo(file.id);
  if (gameInfo?.name) {
    return gameInfo;
  }
  return await scrapingFallback(file, scraping_id);
};

const retrieveGameInfo = async (id) => {
  try {
    return await axios(`${workerUrl}?id=${id}`).then((rsp) => rsp.data);
  } catch (e) {
    console.log(e.message);
  }
};

const fetchWithScreenscraper = async ({ scraping_id, normalizedName, id }) => {
  const screenscraperInfo = await axios(
    `https://www.screenscraper.fr/api2/jeuRecherche.php`,
    {
      timeout: 40000,
      params: {
        devid: process.env.SS_USERNAME,
        devpassword: process.env.SS_PASSWORD,
        softname: "retromatch",
        output: "json",
        systemeid: scraping_id,
        recherche: normalizedName,
        ...(settingsStore.get("screenscraper_password") &&
        settingsStore.get("screenscraper_password")
          ? {
              ssid: settingsStore.get("screenscraper_username"),
              sspassword: settingsStore.get("screenscraper_password")
            }
          : {})
      }
    }
  )
    .then((rsp) => rsp.data.response)
    .catch((e) => console.log(e));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  if (screenscraperInfo?.jeux?.length) {
    const gameInfo = transformResponse(
      screenscraperInfo.jeux[0],
      "screenscraper"
    );
    return await cacheGameInfo(id, gameInfo);
  }

  return null;
};

const scrapingFallback = async (file: any, scraping_id: number) => {
  const normalizedName = file.name
    .replaceAll(/\s*\(.*?\)/gi, "")
    .replaceAll(/\s*\[.*?\]/gi, "")
    .replace("_", " ")
    .replace("!", "")
    .split(/v[0-9]/)[0]
    .trim();
  if (scraping_id === 75) {
    const response = await axios(
      `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
    ).then((rsp) => rsp.data);
    if (response.result[0]) {
      const gameInfo = transformResponse(response.result[0], "arcadeDB");
      return await cacheGameInfo(file.id, gameInfo);
    }
  }

  if (allowedInLetsPlay.map((a) => a.id).includes(scraping_id)) {
    const c = allowedInLetsPlay.find((c) => c.id === scraping_id).name;

    const fuseOptions = {
      includeScore: false,
      minMatchCharLength: 2,
      threshold: 0.4,
      keys: ["name", "alternative_names.name"]
    };

    const fuse = new Fuse(letsPlayGames[c], fuseOptions);
    const response = fuse.search(normalizedName, { limit: 1 })[0];

    if (response?.item) {
      const gameInfo = transformResponse(response.item, "letsplay");
      return await cacheGameInfo(file.id, gameInfo);
    } else {
      return await fetchWithScreenscraper({
        scraping_id,
        id: file.id,
        normalizedName
      });
    }
  }

  return await fetchWithScreenscraper({
    scraping_id,
    id: file.id,
    normalizedName
  });
};

const cacheGameInfo = async (id, info) => {
  try {
    const newInfo = await axios.post(workerUrl, JSON.stringify({ id, info }));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return newInfo.data;
  } catch (e) {
    console.log(e.message);
    return info;
  }
};
