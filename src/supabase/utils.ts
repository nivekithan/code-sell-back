import { supabaseClient } from "./supabase.js";
import { PostgrestResponse } from "@supabase/supabase-js";

const packagesTable = "packages";

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

    console.log(packageVer)
  console.log(res)

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
