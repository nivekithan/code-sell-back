import { createClient } from "@supabase/supabase-js";
import { ENV } from "../env.js";

export const supabaseClient = createClient(
  ENV.SUPABASE_DB_URL,
  ENV.SUPABASE_SERVICE_KEY
);

export const SUPABASE_CONSTANTS = {
  TARBALL_BUCKET: "tarball",
  STORAGE_URL: `${ENV.SUPABASE_DB_URL}/storage/v1`,
  PACKAGES_STORED_TABLE: "packages",
};
