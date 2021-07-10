import { PackageData } from "./supabase/utils";
import { PackageRootObject, PackageVersionObject } from "./types/package";

// Full Name of the function ConvertPackageDataToPackageRoot
export const convertPDataToPRoot = (
  packageData: PackageData<string, string>[]
): PackageRootObject => {
  if (packageData.length === 0) {
    throw new Error(
      `The length of packageData should be greater than 0 to convert it to PackageRootObject `
    );
  }

  const packageRoot = packageData.reduce(
    (accum: PackageRootObject, currValue, i) => {
      if (!accum.name) {
        accum.name = currValue.name;
      }

      if (accum.name !== currValue.name) {
        throw new Error(
          `The name in PackageData[] items should remain constant`
        );
      }

      accum.versions[currValue.version] = currValue.package_version_url;

      return accum;
    },
    { name: "", versions: {} }
  );

  return packageRoot;
};

// Function full name: ConvertPackageDataToPackageVersion
export const convertPDataToPVersion = (
  packageData: PackageData<string, string>[]
): PackageVersionObject => {
  if (packageData.length > 1 || packageData.length < 1) {
    throw new Error(
      `The length of packageData is either greater than 1 or less than 1. It should be exactly 1 to convert it to Package Version Object`
    );
  }

  const packageVersionObject: PackageVersionObject = {
    name: packageData[0].name,
    version: packageData[0].version,
    dist: {
      tarball: packageData[0].tarball_url,
    },
  };

  return packageVersionObject;
};
