import { FastifyRequest, FastifyReply } from "fastify";
import Client, { Route } from "@/handler/Client";
import { getAllSystemInfo } from "@/utils/systemInfo";

export default class Info extends Route {
  app: Client;
  constructor(app: Client) {
    super(app);
    this.app = app;
  }

  execute(req: FastifyRequest, res: FastifyReply): void {
    res.status(200).send({
      data: getAllSystemInfo(),
      success: true,
    });
  }
}
