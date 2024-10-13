import fastify from "fastify";
const app = fastify();

app.get("/", async (req, res) => {
  res.status(200).send("Hello World!");
});

app.listen({ port: 8080 }, () => {
  console.log("Server listening on port 8080 (http://localhost:8080)");
});
