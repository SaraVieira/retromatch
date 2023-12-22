import axios from "axios";
import { transformResponse } from "./response-transform";
import { allowedInLetsPlay } from "../constants";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

export const scrapeGame = async (file: any, scraping_id: number) => {
  const normalizedName = file.name.replaceAll(/\s*\(.*?\)/gi, "");
  if (scraping_id === 75) {
    const response = await axios(
      `http://adb.arcadeitalia.net/service_scraper.php?ajax=query_mame&lang=en&use_parent=1&game_name=${file.name}`
    ).then((rsp) => rsp.data);
    if (response.result[0]) {
      return transformResponse(response.result[0], "arcadeDB");
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

      return transformResponse(response, "letsplay");
    }
  }

  const screenscraperInfo = await axios(
    `https://www.screenscraper.fr/api2/jeuRecherche.php?devid=NikkitaFTW&devpassword=5RnA96uSQAE&softname=retromatch&output=json&systemeid=${scraping_id}&recherche=${normalizedName}`,
    { timeout: 20000 }
  )
    .then((rsp) => rsp.data.response)
    .catch((e) => console.log(e));
  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (screenscraperInfo?.jeux?.length) {
    return transformResponse(screenscraperInfo.jeux[0], "screenscraper");
  }
};
