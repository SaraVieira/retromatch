import { readdirSync, statSync } from "fs";
import { extname } from "path";
import { consoles } from "../../consoles";
import { createID } from ".";

export const getFolders = (path) => {
  const allFolders = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .filter((dir) =>
      consoles
        .map((a) => a.folderNames)
        .flat()
        .includes(dir.name)
    )
    .map((folder) => ({
      path: `${path}/${folder.name}`,
      console: consoles.find((c) =>
        c.folderNames.includes(folder.name.toLocaleLowerCase())
      ),
    }))
    .map((folder) => {
      const files = readdirSync(folder.path)
        .filter((file) =>
          folder.console.extensions.includes(extname(file.toLocaleLowerCase()))
        )
        .map((file) => ({
          name: file.split(extname(file))[0],
          extension: extname(file),
          fullName: file,
          size: statSync(`${folder.path}/${file}`).size,
          //   md5Hash: calculateMD5Hash(`${folder.path}/${file}`),
          //   sha1Hash: calculateSha1Hash(`${folder.path}/${file}`),
        }));
      return {
        ...folder,
        files: files,
      };
    })
    .reduce((acc, curr) => {
      let newCurr = curr.files.reduce((acc, curr) => {
        const fileId = createID();
        acc[fileId] = {
          ...curr,
          id: fileId,
        };
        return acc;
      }, {});
      const folderId = createID();
      acc[folderId] = {
        ...curr,
        id: folderId,
        files: newCurr,
      };
      return acc;
    }, {});

  return allFolders;
};
