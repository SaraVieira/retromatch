import axios from "axios";
import axiosRetry from "axios-retry";
import { allowedInLetsPlay } from "../constants";
import { transformResponse } from "./response-transform";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

const isProd = process.env.NODE_ENV === "production";

const workerUrl = isProd
  ? `${process.env.WORKER_URL}/scrape`
  : "http://localhost:8787/scrape";

export const scrapeGame = async (file: any, scraping_id: number) => {
  const gameInfo = await retrieveGameInfo(file.id);
  if (gameInfo) {
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

const scrapingFallback = async (file: any, scraping_id: number) => {
  const normalizedName = file.name.replaceAll(/\s*\(.*?\)/gi, "").trim();
  if (scraping_id === 75) {
    const response = await axios(
      `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
    ).then((rsp) => rsp.data);
    if (response.result[0]) {
      const gameInfo = transformResponse(response.result[0], "arcadeDB");
      await cacheGameInfo(file.id, gameInfo);
      return gameInfo;
    }
  }

  if (allowedInLetsPlay.map((a) => a.id).includes(scraping_id)) {
    const response = await axios(
      `https://letsplayretro.games/api/scrape?query=${encodeURI(
        normalizedName
      )}&console=${allowedInLetsPlay.find((c) => c.id === scraping_id).name}`
    ).then((rsp) => rsp.data);
    if (response) {
      // wait because prisma cries if we don't
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (response) {
        // wait because prisma cries if we don't
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const gameInfo = transformResponse(response, "letsplay");
        await cacheGameInfo(file.id, gameInfo);
        return gameInfo;
      }
    }
  }

  const screenscraperInfo = await axios(
    `https://www.screenscraper.fr/api2/jeuRecherche.php?devid=${process.env.SS_USERNAME}&devpassword=${process.env.SS_PASSWORD}&softname=retromatch&output=json&systemeid=${scraping_id}&recherche=${normalizedName}`,
    { timeout: 20000 }
  )
    .then((rsp) => rsp.data.response)
    .catch((e) => console.log(e));
  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (screenscraperInfo?.jeux?.length) {
    const gameInfo = transformResponse(
      screenscraperInfo.jeux[0],
      "screenscraper"
    );
    await cacheGameInfo(file.id, gameInfo);
    return gameInfo;
  }
};

const cacheGameInfo = async (id, info) => {
  try {
    await axios.post(workerUrl, JSON.stringify({ id, info }));
  } catch (e) {
    console.log(e.message);
  }
};
