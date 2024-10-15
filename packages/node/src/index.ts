import "dotenv/config";
import fastify from "fastify";
import Client from "@/handler/Client";

export const app = fastify();
new Client(app).init();
