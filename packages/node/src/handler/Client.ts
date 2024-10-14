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

    this.app.setNotFoundHandler((req, res) => {
      res
        .status(404)
        .send({ data: { message: "Route not found" }, success: false });
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
      const formattedRoute =
        file
          .replaceAll("\\", "/")
          .replaceAll("/index.js", "")
          .split("routes")[1]
          .replaceAll("[", ":") || "/";

      console.log(`Loaded ${formattedRoute}`);
      this.handler.set(formattedRoute, route);

      this.app.all(
        formattedRoute,
        async (req: FastifyRequest, res: FastifyReply) => {
          if (req.method === "GET") {
            route.GET(req, res) ||
              route.execute(req, res) ||
              res
                .status(404)
                .send({ data: { message: "Route not found" }, success: false });
          } else if (req.method === "POST") {
            route.POST(req, res) ||
              route.execute(req, res) ||
              res
                .status(404)
                .send({ data: { message: "Route not found" }, success: false });
          } else if (req.method === "PUT") {
            route.PUT(req, res) ||
              route.execute(req, res) ||
              res
                .status(404)
                .send({ data: { message: "Route not found" }, success: false });
          } else if (req.method === "PATCH") {
            route.PATCH(req, res) ||
              route.execute(req, res) ||
              res
                .status(404)
                .send({ data: { message: "Route not found" }, success: false });
          } else if (req.method === "DELETE") {
            route.DELETE(req, res) ||
              route.execute(req, res) ||
              res
                .status(404)
                .send({ data: { message: "Route not found" }, success: false });
          }
        }
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

  GET(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }
  POST(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }
  PUT(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }
  PATCH(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }
  DELETE(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }

  execute(req: FastifyRequest, res: FastifyReply): false | void {
    return false;
  }
}
