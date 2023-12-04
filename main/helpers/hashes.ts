import { createHash } from "crypto";
import { readFile } from "fs/promises";

export const calculateSha1Hash = async (file: string) => {
  const fileRead = await readFile(file);
  var sha1sum = createHash("sha1").update(fileRead).digest("hex");
  return sha1sum;
};

export const calculateMD5Hash = async (file: string) => {
  const fileRead = await readFile(file);
  var sha1sum = createHash("md5").update(fileRead).digest("hex");
  return sha1sum;
};
