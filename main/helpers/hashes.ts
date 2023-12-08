import { createHash } from "crypto";
import { readFile } from "fs/promises";
import fs from "fs-extra";

export function calculateMD5(filePath) {
  return new Promise((resolve, reject) => {
    let hash = createHash("md5");
    let stream = fs.createReadStream(filePath);

    stream.on("error", function (err) {
      reject(err);
    });

    stream.on("data", function (data: any) {
      hash.update(data, "utf8");
    });

    stream.on("end", function () {
      stream.close();
      resolve(hash.digest("hex"));
    });
  });
}

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
