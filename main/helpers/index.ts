export * from "./create-window";

import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

export const transformResponse = (data: any, type: string) => {
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
