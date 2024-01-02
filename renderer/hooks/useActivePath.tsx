import { useRouter } from "next/router";
import { useFolders } from "./folder-context";
import { useRoms } from "./roms-context";

export const useActivePath = () => {
  const { folders } = useFolders();
  const { query } = useRouter();
  const { roms } = useRoms();

  const activeFolder = folders[query.folder as string];
  const activeConsole = activeFolder?.folders[query.path as string];
  const activeRom = roms[query.file as string];

  return {
    activeConsole,
    activeFolder,
    activeRom
  };
};
