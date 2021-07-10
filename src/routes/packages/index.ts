import { FastifyInstance } from "fastify";
import {
  getPackageByNameAndVer,
  getPackagesByName,
} from "../../supabase/utils.js";
import { convertPDataToPRoot, convertPDataToPVersion } from "../../utils.js";

const routes = async (fastify: FastifyInstance) => {
  type AParams = {
    package_name: string;
  };

  type AGeneric = {
    Params: AParams;
  };

  fastify.get<AGeneric>("/:package_name", async (req, reply) => {
    const packageName = decodeURIComponent(req.params.package_name);

    const packagesInfo = await getPackagesByName(packageName);

    if (packagesInfo.data) {
      return convertPDataToPRoot(packagesInfo.data);
    } else {
      return reply
        .code(packagesInfo.status)
        .send({ error: packagesInfo.error.message });
    }
  });

  type BParams = {
    package_name: string;
    version: string;
  };

  type BGeneric = {
    Params: BParams;
  };

  fastify.get<BGeneric>("/:package_name/:version", async (req, reply) => {
    const packageName = decodeURIComponent(req.params.package_name);
    const packageVersion = decodeURIComponent(req.params.version);

    const packageInfo = await getPackageByNameAndVer(
      packageName,
      packageVersion
    );

    if (packageInfo.data) {
      return convertPDataToPVersion(packageInfo.data);
    } else {
      return reply
        .code(packageInfo.status)
        .send({ error: packageInfo.error.message });
    }
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

      await getPackagesByName(nameOfThePackage);
    }
  );
};

export default routes;
