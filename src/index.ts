import "./dotenv.js";
import fastifyDefault from "fastify";
import fastifyMultipart from "fastify-multipart";
import packageRoutes from "./routes/packages/index.js";

const fastify = fastifyDefault({ logger: { prettyPrint: true } });

fastify.register(fastifyMultipart);

fastify.register(packageRoutes);


const start = async () => {
  const port = 5000;

  try {
    await fastify.listen(port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
