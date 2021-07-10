export type PackageVersionUrl = string;

export type PackageRootObject = {
  name: string;
  versions: Record<string, PackageVersionUrl>;
};
