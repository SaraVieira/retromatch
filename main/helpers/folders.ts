import { createID } from ".";
import { RomFolder } from "../../types";

export const getFolders = async (folders): Promise<RomFolder["folders"]> => {
  const allFolders = await Promise.all(
    folders
      .filter((dir) => dir.console)
      .map((folder) => ({
        path: `${folder.path}/${folder.name}`,
        console: folder.console,
        files: []
      }))
  );

  return allFolders.reduce((acc, curr) => {
    const folderId = createID();
    acc[folderId] = {
      ...curr,
      id: folderId
    };
    return acc;
  }, {});
};
