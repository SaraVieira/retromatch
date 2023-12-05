export const transformResponse = (data: any, type: string) => {
  if (!data) return null;
  if (type === "letsplay") {
    const findDev = () => {
      if (!data.involved_companies.length) return null;

      const hasDev = data.involved_companies.find((i) => i.developer);

      const company = hasDev ? hasDev : data.involved_companies[0];

      return company?.company?.name;
    };

    const imageUrl = (url) => "https:" + url.replace("t_thumb", "t_720p");
    return {
      url: data.url,
      title: data.name,
      developer: {
        name: findDev(),
      },
      images: {
        screenshots: data.screenshots.length
          ? data.screenshots.map((s) => imageUrl(s.url))
          : undefined,
        title: undefined,
        cover: imageUrl(data.cover.url),
      },
      genre: data.genres.map((g) => g.name).join(" / "),
      players: "",
      released: new Date(data.first_release_date * 1000).toLocaleString(
        "PT-pt",
        {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }
      ),
      videos: {
        youtube: data.videos.length ? data.videos.length[0]?.video_id : null,
        shortplay: null,
      },
      summary: data.summary,
      rating: data.total_rating,
      series: data.franchise?.name,
    };
  }
  if (type === "arcadeDB") {
    return {
      url: data.url,
      title: data.short_title || data.title,
      summary: data.history,
      developer: {
        name: data.manufacturer,
      },
      images: {
        screenshots: [data.url_image_ingame],
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
      rating: data.rate,
      series: data.series,
    };
  }
};
