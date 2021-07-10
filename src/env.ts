export type ENV = {
  SUPABASE_SERVICE_KEY: string;
  SUPABASE_DB_URL: string;
};

export const ENV = {
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
} as ENV;
