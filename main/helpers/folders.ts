import { readFile, readdir, stat } from "fs/promises";
import { extname } from "path";
import { consoles } from "../../consoles";
import { createID } from ".";
import XXH from "xxhashjs";
import { calculateMD5, calculateMD5Hash } from "./hashes";

export const getFolders = async (
  path: string,
  win: Electron.CrossProcessExports.BrowserWindow
) => {
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
          ).filter((file) =>
            folder.console.extensions.includes(
              extname(file.toLocaleLowerCase())
            )
          )
        );
        return {
          ...folder,
          files: files,
        };
      })
  );
  const allFilesNumber = allFolders.reduce((acc, curr) => {
    acc = acc + curr.files.length;

    return acc;
  }, 0);
  let current = 0;

  const allFoldersWithFiles = await Promise.all(
    allFolders.map(async (folder) => {
      return {
        ...folder,
        files: await Promise.all(
          folder.files.map(async (file) => {
            const size = (await stat(`${folder.path}/${file}`)).size;
            const newFile = {
              name: file.split(extname(file))[0],
              extension: extname(file),
              fullName: file,
              size,
              md5Hash: await calculateMD5(`${folder.path}/${file}`),
              // sha1Hash: calculateSha1Hash(`${folder.path}/${file}`),
            };
            current = current + 1;
            win.webContents.send("sync_progress", {
              current,
              total: allFilesNumber,
            });

            return newFile;
          })
        ),
      };
    })
  );

  return allFoldersWithFiles.reduce((acc, curr) => {
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
