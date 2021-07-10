export type PackageVersionUrl = string;

export type PackageRootObject = {
  name: string;
  versions: Record<string, PackageVersionUrl>;
};

export type PackageVersionObject = {
  name: string;
  version: string;
  dist: {
    tarball: string;
  };
};
