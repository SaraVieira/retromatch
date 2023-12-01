import axios from "axios";

export const getGame = async ({ game }) => {
  const options = {
    method: "GET",
    url: "https://www.screenscraper.fr/api2/jeuInfos.php",
    params: {
      devid: "NikkitaFTW",
      devpassword: "5RnA96uSQAE",
      softname: "rommatcher",
      output: "json",
      md5: game.md5,
      sha1: game.sha1,
      systemeid: game.screenscrapper_id,
      romtype: "rom",
      romnom: game.full_name,
      romtaille: game.size,
      ssid: "NikkitaFTW",
      sspassword: "madinalake",
    },
  };

  try {
    const data = await axios.request(options);
    return data.data.response.jeu;
  } catch (e) {
    console.log(e);
  }
};
