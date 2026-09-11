import { fileURLToPath } from "url";
import { createServer } from "http";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

wisp.options.allow_udp_streams = false;

const serverFactory = (handler: any) => {
  return createServer()
    .on("request", (req, res) => handler(req, res))
    .on("upgrade", (req, socket, head) => {
      wisp.routeRequest(req, socket, head);
    });
};

const app = fastify({
  logger: false,
  serverFactory
});

const gameFrameScript = `
<script>
(() => {
  const resizeGame = () => {
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.querySelectorAll("canvas, #game, #gameContainer, #unityContainer, .webgl-content").forEach((element) => {
      element.style.maxWidth = "100%";
      element.style.maxHeight = "100%";
    });
  };

  window.addEventListener("resize", resizeGame);
  document.addEventListener("fullscreenchange", resizeGame);
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (target && typeof target.focus === "function") target.focus();
  }, true);
  resizeGame();
  new MutationObserver(resizeGame).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

app.addHook("onSend", async (request, reply, payload) => {
  if (!request.url.startsWith("/game-assets/") || !request.url.endsWith(".html")) {
    return payload;
  }

  const html = Buffer.isBuffer(payload) ? payload.toString("utf8") : String(payload);
  if (!html.includes("</body>")) return payload;

  reply.type("text/html");
  return html.replace("</body>", `${gameFrameScript}</body>`);
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
  prefix: "/",
  decorateReply: false,
  wildcard: false
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "assets", "src"),
  prefix: "/game-assets/",
  decorateReply: false
});

app.setNotFoundHandler((req, reply) => {
  const indexPath = path.join(__dirname, "dist", "index.html");

  if (fs.existsSync(indexPath)) {
    reply.type("text/html").send(fs.readFileSync(indexPath));
  } else {
    reply.code(404).send("index.html not found");
  }
});

app.listen(
  { host: "0.0.0.0", port: parseInt(process.env.PORT || "1111") },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`server listening on ${address}`);
  }
);