import { readdir, stat } from "fs/promises";
import { extname } from "path";
import { consoles } from "../../consoles";
import { createID } from ".";

export const getFolders = async (path) => {
  const pathRead = await readdir(path, { withFileTypes: true });
  const allFolders = await Promise.all(
    pathRead
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
      .filter((dir) =>
        consoles
          .map((a) => a.folderNames)
          .flat()
          .includes(dir.name.toLocaleLowerCase())
      )
      .map((folder) => ({
        path: `${path}/${folder.name}`,
        console: consoles.find((c) =>
          c.folderNames.includes(folder.name.toLocaleLowerCase())
        ),
      }))
      .map(async (folder) => {
        const files = await Promise.all(
          (
            await readdir(folder.path)
          )
            .filter((file) =>
              folder.console.extensions.includes(
                extname(file.toLocaleLowerCase())
              )
            )
            .map(async (file) => {
              const size = (await stat(`${folder.path}/${file}`)).size;
              return {
                name: file.split(extname(file))[0],
                extension: extname(file),
                fullName: file,
                size,
                // md5Hash: await calculateMD5Hash(`${folder.path}/${file}`),
                //   sha1Hash: calculateSha1Hash(`${folder.path}/${file}`),
              };
            })
        );
        return {
          ...folder,
          files: files,
        };
      })
  );

  return allFolders.reduce((acc, curr) => {
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
};
