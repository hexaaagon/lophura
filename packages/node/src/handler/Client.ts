import { Collection } from "@discordjs/collection";
import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { glob } from "glob";
import path from "path";

export default class Client {
  app: FastifyInstance;
  handler: Collection<string, Route>;

  constructor(app: FastifyInstance) {
    this.app = app;
    this.handler = new Collection();
  }

  async init() {
    await this.LoadHandlers();

    this.app.all("*", async (req: FastifyRequest, res: FastifyReply) => {
      const route = this.handler.get(req.url);

      if (route) {
        if (req.method === "GET") {
          route.GET(req, res);
        } else if (req.method === "POST") {
          route.POST(req, res);
        } else if (req.method === "PUT") {
          route.PUT(req, res);
        } else if (req.method === "PATCH") {
          route.PATCH(req, res);
        } else if (req.method === "DELETE") {
          route.DELETE(req, res);
        }
      } else {
        res.status(404).send({
          error: "Not Found",
          message: "Route not found",
        });
      }
    });
    this.app.listen({ port: 8080 }, () => {
      console.log("Listening on port 8080 - http://localhost:8080");
    });
  }

  async LoadHandlers() {
    const files = (await glob("dist/routes/**/*.js")).map((filePath) =>
      path.resolve(filePath)
    );

    files.map(async (file) => {
      const route: Route = new (await import(file)).default(this.app);

      console.log(
        `Loaded ${file.replaceAll("\\", "/").replaceAll("/index.js", "").split("routes")[1] || "/"}`
      );
      this.handler.set(
        file
          .replaceAll("\\", "/")
          .replaceAll("/index.js", "")
          .split("routes")[1] || "/",
        route
      );
    });
  }
}

export class Route {
  description?: string;
  app: Client;

  constructor(
    app: Client,
    options?: {
      description?: string;
    }
  ) {
    this.app = app;
    this.description = options?.description;
  }

  GET(req: FastifyRequest, res: FastifyReply): void {
    res.status(405).send({
      error: "Method Not Allowed",
      message: "Method not allowed",
    });
  }
  POST(req: FastifyRequest, res: FastifyReply): void {
    res.status(405).send({
      error: "Method Not Allowed",
      message: "Method not allowed",
    });
  }
  PUT(req: FastifyRequest, res: FastifyReply): void {
    res.status(405).send({
      error: "Method Not Allowed",
      message: "Method not allowed",
    });
  }
  PATCH(req: FastifyRequest, res: FastifyReply): void {
    res.status(405).send({
      error: "Method Not Allowed",
      message: "Method not allowed",
    });
  }
  DELETE(req: FastifyRequest, res: FastifyReply): void {
    res.status(405).send({
      error: "Method Not Allowed",
      message: "Method not allowed",
    });
  }
}
