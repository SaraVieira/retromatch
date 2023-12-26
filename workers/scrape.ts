interface Env {
  retromatch: KVNamespace;
  IMAGES_BUCKET: R2Bucket;
}

type GameInfo = {
  id: string;
  info?: any;
};

const uploadImage = async (img: string, type: string, id: string, env: Env) => {
  const image = await fetch(img).then((rsp) => rsp.arrayBuffer());
  if (image.byteLength > 500) {
    const fileName = `${id}-${type}.${type === "shortplay" ? "mp4" : "png"}`;
    await env.IMAGES_BUCKET.put(fileName, image);

    return `https://pub-418a6bb9e58e4413884f0f5caf6f5f6e.r2.dev/${fileName}`;
  }
  return img;
};

const fetchAllImages = async (info: any, id: string, env: Env) => {
  let cover;
  if (info.images.cover) {
    cover = !info.images.cover.includes("r2.dev/")
      ? await uploadImage(info.images.cover, "cover", id, env)
      : info.images.cover;
  }
  let title;
  if (info.images.title) {
    title = !info.images.title.includes("r2.dev/")
      ? await uploadImage(info.images.title, "title", id, env)
      : info.images.title;
  }
  let shortplay;
  if (info.videos.shortplay) {
    shortplay = !info.videos.shortplay.includes("r2.dev/")
      ? await uploadImage(info.videos.shortplay, "shortplay", id, env)
      : info.videos.shortplay;
  }
  let screenshots;
  if (info.images.screenshots.length) {
    screenshots = await Promise.all(
      info.images.screenshots.map(async (s: string) =>
        !s.includes("r2.dev/")
          ? await uploadImage(s, "screenshots", id, env)
          : s
      )
    );
  }

  const newInfo = JSON.stringify({
    ...info,
    images: {
      ...info.images,
      cover,
      title,
      screenshots
    },
    videos: {
      ...info.videos,
      shortplay
    }
  });
  return newInfo;
};

const handle: ExportedHandler = {
  async fetch(request: Request, env: Env, _ctx) {
    if (request.method === "POST") {
      const { id, info } = (await request.json()) as GameInfo;
      const newInfo = await fetchAllImages(info, id, env);

      await env.retromatch.put(id, newInfo);
      return new Response(newInfo);
    } else {
      const id = new URLSearchParams(new URL(request.url).search).get("id");
      const value = await env.retromatch.get(id);

      if (value) {
        const newInfo = await fetchAllImages(JSON.parse(value), id, env);
        if (newInfo !== value) {
          await env.retromatch.put(id, newInfo);
        }
        return new Response(newInfo);
      } else {
        return new Response();
      }
    }
  }
};

export default handle;
