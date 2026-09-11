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