interface Env {
  retromatch: KVNamespace;
}

type GameInfo = {
  id: string;
  info?: any;
};

const handler: ExportedHandler = {
  async fetch(request: Request, env: Env, _ctx) {
    const { id, info } = (await request.json()) as GameInfo;
    if (request.method === "POST") {
      await env.retromatch.put(id, info);
      return new Response(info);
    } else {
      const value = await env.retromatch.get(id);
      if (value) {
        return new Response(value);
      } else {
        return new Response("Value not found", { status: 404 });
      }
    }
  }
};

export default handler;
