interface Env {
  retromatch: KVNamespace;
}

type GameInfo = {
  id: string;
  info?: any;
};

const handle: ExportedHandler = {
  async fetch(request: Request, env: Env, _ctx) {
    if (request.method === "POST") {
      const { id, info } = (await request.json()) as GameInfo;
      const newInfo = JSON.stringify(info);
      await env.retromatch.put(id, newInfo);
      return new Response(newInfo);
    } else {
      const id = new URLSearchParams(new URL(request.url).search).get("id");
      const value = await env.retromatch.get(id);
      if (value) {
        return new Response(value);
      } else {
        return new Response();
      }
    }
  }
};

export default handle;
