import { PackageData } from "./supabase/utils";
import { PackageRootObject } from "./types/package";

// Full Name of the function ConvertPackageDataToPackageRoot
export const convertPDataToPRoot = (
    packageData: PackageData<string>[]
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