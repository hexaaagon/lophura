import { FastifyRequest, FastifyReply } from "fastify";
import Client, { Route } from "@/handler/Client";

export default class Index extends Route {
  app: Client;
  constructor(app: Client) {
    super(app);
    this.app = app;
  }

  GET(req: FastifyRequest, res: FastifyReply): void {
    res.status(200).send({
      message: "Hello world",
    });
  }
}
