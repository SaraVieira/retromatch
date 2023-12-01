import { createHash } from "crypto";
import { readFileSync } from "fs";

export function calculateSha1Hash(file: string) {
  var sha1sum = createHash("sha1").update(readFileSync(file)).digest("hex");
  return sha1sum;
}

export function calculateMD5Hash(file: string) {
  var sha1sum = createHash("md5").update(readFileSync(file)).digest("hex");
  return sha1sum;
}
