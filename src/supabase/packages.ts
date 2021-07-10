import { supabaseClient, SUPABASE_CONSTANTS } from "./supabase.js";
import { PostgrestResponse } from "@supabase/supabase-js";
import { ENV } from "../env.js";

const packagesTable = SUPABASE_CONSTANTS.PACKAGES_STORED_TABLE;

export type PackageData<Name extends string, Version extends string> = {
  id: number;
  inserted_at: string;
  updated_at: string;
  name: Name;
  version: Version;
  tarball_url: string;
  package_root_url: string;
  package_version_url: string;
};

export const getPackagesByName = async <Name extends string>(
  packageName: Name
): Promise<PostgrestResponse<PackageData<Name, string>>> => {
  const res = await supabaseClient
    .from<PackageData<Name, string>>(packagesTable)
    .select("*")
    .eq("name", packageName);

  if (res.data && res.data.length === 0) {
    return {
      data: null,
      body: null,
      count: null,
      error: {
        code: "404",
        details: `No package with name ${packageName} available`,
        message: `No package with name ${packageName} available`,
        hint: `No package with name ${packageName} available`,
      },
      status: 404,
      statusText: "Not found",
    };
  }

  return res;
};

export const getPackageByNameAndVer = async <
  Name extends string,
  Version extends string
>(
  packageName: Name,
  packageVer: Version
): Promise<PostgrestResponse<PackageData<Name, Version>>> => {
  const res = await supabaseClient
    .from<PackageData<Name, Version>>(packagesTable)
    .select("*")
    .eq("name", packageName)
    .eq("version", packageVer);

  if (res.data && res.data.length === 0) {
    return {
      data: null,
      body: null,
      count: null,
      error: {
        code: "404",
        details: `No package with name: ${packageName} and version ${packageVer} is available`,
        message: `No package with name: ${packageName} and version ${packageVer} is available`,
        hint: `No package with name: ${packageName} and version ${packageVer} is available`,
      },
      status: 404,
      statusText: "Not Found",
    };
  }

  if (res.data && res.data.length > 1) {
    return {
      data: null,
      body: null,
      count: null,
      error: {
        code: "500",
        details: `There are two packages with same name and same version. It should not have happened. 
                   Name: ${packageName}
                   Version: ${packageVer}`,
        hint: `There are two packages with same name and same version. It should not have happened. 
                   Name: ${packageName}
                   Version: ${packageVer}`,
        message: `There are two packages with same name and same version. It should not have happened. 
                   Name: ${packageName}
                   Version: ${packageVer}`,
      },
      status: 500,
      statusText: "Something is gone wrong",
    };
  }

  return res;
};

export const uploadPackagesByNameAndVer = async <
  Name extends string,
  Version extends string
>(
  packageName: Name,
  packageVer: Version,
  tarballUrl: string
) => {
  const packageRootUrl = encodeURIComponent(`${ENV.DOMAIN_URL}/${packageName}`);
  const packageVersionUrl = encodeURIComponent(
    `${ENV.DOMAIN_URL}/${packageName}/${packageVer}`
  );

  const res = await supabaseClient
    .from<PackageData<Name, Version>>(packagesTable)
    .insert([
      {
        name: packageName,
        version: packageVer,
        package_root_url: packageRootUrl,
        package_version_url: packageVersionUrl,
        tarball_url: tarballUrl,
      },
    ]);

  console.log(res);

  return res;
};

export const isPackagePresentWithNameAndVer = async (
  packageName: string,
  packageVer: string
) => {
  try {
    const res = await supabaseClient
      .from<PackageData<string, string>>(packagesTable)
      .select("id")
      .eq("name", packageName)
      .eq("version", packageVer);

    if (res.body && res.body.length > 0) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
