import { FastifyInstance } from "fastify";
import { getPackage } from "../../supabase/utils.js";
import { convertPDataToPRoot } from "../../utils.js";

const routes = async (fastify: FastifyInstance) => {
  type AParams = {
    package_name: string;
  };

  type AGeneric = {
    Params: AParams;
  };

  fastify.get<AGeneric>("/:package_name", async (req, reply) => {
    const packageName = decodeURIComponent(req.params.package_name);
    const res = await getPackage(packageName);

    if (res.data) {
      return convertPDataToPRoot(res.data);
    } else {
      return reply.code(res.status).send({ error: res.error.message });
    }
  });

  fastify.get("/:packageName/:version", async () => {
    return "Not Implemented";
  });

  type TParams = {
    packageName: string;
    version: string;
  };

  fastify.post<{ Params: TParams }>(
    "/:packageName/:version",
    async (req, reply) => {
      const multipartData = await req.file();

      const parmName = decodeURIComponent(req.params.packageName);
      const parmVersion = decodeURIComponent(req.params.version);

      const nameOfThePackage = (
        multipartData.fields.name as unknown as
          | Record<string, string>
          | undefined
      )?.value;

      const versionOfThePackage = (
        multipartData.fields.version as unknown as
          | Record<string, string>
          | undefined
      )?.value;

      if (parmName !== nameOfThePackage) {
        return reply.code(400).send({
          error:
            "The package name in url and the package in the request does not match",
        });
      } else if (parmVersion !== versionOfThePackage) {
        return reply.code(400).send({
          error:
            "The version of package in url and the version of package in the request does not match",
        });
      }

      await getPackage(nameOfThePackage);
    }
  );
};

export default routes;
