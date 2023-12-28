export const transformResponse = (data: any, type: string) => {
  if (!data) return null;
  if (type === "letsplay") {
    const findDev = () => {
      if (!data.involved_companies?.length) return null;

      const hasDev = data.involved_companies.find((i) => i.developer);

      const company = hasDev ? hasDev : data.involved_companies[0];

      return company?.company?.name;
    };

    const imageUrl = (url) =>
      url ? "https:" + url.replace("t_thumb", "t_720p") : "";
    return {
      url: data.url,
      title: data.name,
      developer: {
        name: findDev()
      },
      images: {
        screenshots: data.screenshots?.length
          ? data.screenshots.map((s) => imageUrl(s.url))
          : undefined,
        title: undefined,
        cover: imageUrl(data.cover?.url)
      },
      genre: data.genres?.length
        ? data.genres.map((g) => g.name).join(" / ")
        : "",
      players: "",
      released: new Date(data.first_release_date * 1000).toLocaleString(
        "PT-pt",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric"
        }
      ),
      videos: {
        youtube: data.videos?.length > 0 ? data.videos[0]?.video_id : null,
        shortplay: null
      },
      summary: data.summary,
      rating: data.total_rating,
      series: data.franchise?.name
    };
  }
  if (type === "arcadeDB") {
    return {
      url: data.url,
      title: data.short_title || data.title,
      summary: data.history,
      developer: {
        name: data.manufacturer
      },
      images: {
        screenshots: [data.url_image_ingame],
        title: data.url_image_title,
        cover: data.url_image_flyer
      },
      genre: data.genre,
      players: data.players,
      released: data.year,
      videos: {
        youtube: data.youtube_video_id,
        shortplay: data.url_video_shortplay
      },
      rating: data.rate,
      series: data?.series
    };
  }
  if (type === "screenscraper") {
    if (!Object.keys(data).length) return null;
    const regionsAllowed = ["us", "wor", "eu"];

    const title =
      data.noms.find((n) => regionsAllowed.includes(n.region))?.text ||
      data.noms[0]?.text;
    const mediasInEnglish =
      data.medias
        .filter((m) => regionsAllowed.includes(m.region) || !m.region)
        .filter((a) => a.type !== "fanart") || [];

    return {
      url: `https://www.screenscraper.fr/gameinfos.php?gameid=${data.id}&zone=gameinfosinfos`,
      title: title,
      summary: data?.synopsis?.length
        ? data.synopsis.find((s) => s.langue === "en")?.text
        : null,
      developer: {
        name: data.developpeur?.text || data.editeur?.text
      },
      images: {
        screenshots: (
          mediasInEnglish.filter((m) => m?.type === "ss") || []
        ).map((a) => a?.url),
        title: mediasInEnglish.find((m) => m?.type === "sstitle")?.url,
        cover: mediasInEnglish.find((m) => m?.type === "box-2D")?.url
      },
      genre: data.genres?.length
        ? (data.genres.map((g) => g.noms).filter((n) => n.lang === "en") || [])
            .map((b) => b?.text)
            .join(" / ")
        : "",
      players: data.joueurs?.text,
      released: data.dates?.length ? data.dates[0]?.text : "",
      videos: {
        youtube: null,
        shortplay:
          (mediasInEnglish || []).find(
            (m) => m?.type === "video" || m?.type === "video-normalized"
          )?.url || null
      },
      rating: data.note ? parseInt(data.note.text) * 5 : 0,
      series: data.familles?.length ? data.familles[0]?.noms[0]?.text : null
    };
  }
};
