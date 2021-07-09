import fastifyDefault from "fastify";

const fastify = fastifyDefault({ logger: true });

fastify.get("/", async (req, res) => {
  return { hello: "world! Changed" };
});

const start = async () => {
  try {
    await fastify.listen(5000);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1);
  }
};

start();
