import FormData from "form-data";
import { SUPABASE_CONSTANTS } from "./supabase.js";
import fetch, { Headers } from "node-fetch";
import { ENV } from "../env.js";

const storageUrl = SUPABASE_CONSTANTS.STORAGE_URL;
const tarballBucket = SUPABASE_CONSTANTS.TARBALL_BUCKET;
const serviceKey = ENV.SUPABASE_SERVICE_KEY;

export const uploadTarballToStorage = async (
  fd: FormData,
  filePath: string
): Promise<{ error: string } | string> => {

  const url = `${storageUrl}/object/${tarballBucket}/${filePath}`;
  const supabaseHeaders = new Headers();

  supabaseHeaders.set("apikey", serviceKey);
  supabaseHeaders.set("Authorization", `Bearer ${serviceKey}`);

  type StorageResponse = {
    Key: string;
  };

  const res = await fetch(url, {
    method : "POST",
    headers: supabaseHeaders,
    body: fd,
  });

  if (res.ok) {
    const keyRes: StorageResponse = await res.json();
    return keyRes.Key;
  }

  const error = await res.json();

  return { error: error.message };
};
