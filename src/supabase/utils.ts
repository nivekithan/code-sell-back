import { supabaseClient } from "./supabase.js";
import { PostgrestResponse } from "@supabase/supabase-js";
import { PackageRootObject } from "../types/package.js";

export type PackageData<Name extends string> = {
  id: number;
  inserted_at: string;
  updated_at: string;
  name: Name;
  version: string;
  tarball_url: string;
  package_root_url: string;
  package_version_url: string;
};

export const getPackage = async <Name extends string>(
  packageName: Name
): Promise<PostgrestResponse<PackageData<Name>>> => {
  const packagesTable = "packages";

  const res: PostgrestResponse<PackageData<Name>> = await supabaseClient
    .from(packagesTable)
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

