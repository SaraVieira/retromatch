import { readdir, stat } from "fs/promises";
import { consoles } from "../../consoles";
import { createID } from ".";
import { RomFolder, RomFolders } from "../../types";

export const getFolders = async (path): Promise<RomFolder["folders"]> => {
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
        files: [],
      }))
  );

  return allFolders.reduce((acc, curr) => {
    const folderId = createID();
    acc[folderId] = {
      ...curr,
      id: folderId,
    };
    return acc;
  }, {});
};
