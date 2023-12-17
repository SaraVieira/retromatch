import { readdir, stat } from "fs/promises";
import { extname } from "path";
import { v5 as uuidv5 } from "uuid";

import { Folder } from "../../types";
import { foldersStore, romsStore } from "./stores";

export const getRoms = async ({
  allFolders,
  id
}: {
  allFolders: {
    [id: string]: Folder;
  };
  id: string;
}) => {
  try {
    await Promise.all(
      Object.values(allFolders).map(async (folder) => {
        return await Promise.all(
          (
            await readdir(folder.path, { withFileTypes: true })
          )
            .filter((dirent) => dirent.isFile() && !dirent.name.startsWith("."))
            .filter((file) =>
              folder.console.extensions.includes(
                extname(file.name.toLocaleLowerCase())
              )
            )
            .map(async (file) => {
              const size = (await stat(`${folder.path}/${file.name}`)).size;

              const newFile = {
                name: file.name.split(extname(file.name))[0],
                extension: extname(file.name),
                fullName: file.name,
                size
              };
              const fileId = uuidv5(
                `${newFile.fullName}${newFile.size}${folder.console.id}`,
                uuidv5.URL
              );
              foldersStore.set(`${id}.folders.${folder.id}.files`, [
                ...((foldersStore.get(`${id}.folders.${folder.id}.files`) ||
                  []) as any[]),
                fileId
              ]);
              if (!romsStore.get(fileId)) {
                romsStore.set(fileId, {
                  ...newFile,
                  id: fileId
                });
              }
            })
        );
      })
    );

    return foldersStore.get(id);
  } catch (e) {
    console.log(e);
  }
};
