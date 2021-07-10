import "./dotenv.js";
import fastifyDefault from "fastify";
import fastifyMultipart from "fastify-multipart";
import { ENV } from "./env.js";
import FormData from "form-data";
import { nanoid } from "nanoid";
import { SUPABASE_CONSTANTS } from "./supabase/supabase.js";
import fetch, { Headers } from "node-fetch";
import packageRoutes from "./routes/packages/index.js";

const fastify = fastifyDefault({ logger: { prettyPrint: true } });

fastify.register(fastifyMultipart);

fastify.register(packageRoutes);

fastify.post("/upload", async (req, res) => {
  const data = await req.file();
  const filePath = `${nanoid()}.tgz`;

  console.log(data);

  const fd = new FormData();

  fd.append("", await data.file, filePath);
  fd.append("cacheControl", 3600);

  const response = await storeInStorage(fd, filePath);

  if (response.ok) {
    const json = await response.json();
    return res.code(200).send({ key: json.Key });
  } else {
    const error = await response.json();
    return res.status(400).send({ error: "Something is gone wrong" });
  }
});

const start = async () => {
  const port = 5000;

  try {
    await fastify.listen(port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const storeInStorage = async (fd: FormData, filePath: string) => {
  const path = `${SUPABASE_CONSTANTS.STORAGE_URL}/object/${SUPABASE_CONSTANTS.TARBALL_BUCKET}/${filePath}`;
  const supabaseHeaders = new Headers();
  supabaseHeaders.set("apikey", ENV.SUPABASE_SERVICE_KEY);
  supabaseHeaders.set("Authorization", `Bearer ${ENV.SUPABASE_SERVICE_KEY}`);

  return fetch(path, { method: "POST", headers: supabaseHeaders, body: fd });
};

start();
