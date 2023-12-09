import * as React from "react";
import { useRouter } from "next/router";

import { Folder, RomFolder, RomFolders, Roms } from "../../types";
import { useRoms } from "./roms-context";
import { consoles } from "../../consoles";

const FoldersContext = React.createContext({
  folders: {} as RomFolders,
  addFolder: (_: RomFolder) => {},
  scrapeFolder: (_folder: Folder, _all: boolean) => {},
  syncFolders: () => {},
  isSyncing: false,
  isLoading: false,
  folderMatches: [],
  // eslint-disable-next-line
  setFolderMatch: ({ id, name }: { id: string; name: string }) => {}
});

function FolderProvider({ children }) {
  const [folders, setFolders] = React.useState({});
  const [isSyncing, setIsSyncing] = React.useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [folderMatches, setFolderMatches] = React.useState([]);
  const { setRoms } = useRoms();
  const [selectedFolder, setSelectedFolder] = React.useState({});

  const getData = () => {
    setIsLoading(true);
    window.ipc.on("all_data", (folders: RomFolders[]) => {
      setFolders(folders);
      setIsLoading(false);
    });

    window.ipc.send("load", null);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const addFolder = (folder: RomFolder) => {
    window.ipc.send("add_folder", folder);
    setSelectedFolder(folder);

    window.ipc.on("folders_found", setFolderMatches);
    router.push("/new/matches");
  };

  const syncFolders = () => {
    setIsSyncing(true);
    getData();

    window.ipc.send("sync_folder", {
      folders: folderMatches,
      mainFolder: selectedFolder
    });
    window.ipc.on(
      "done_syncing",
      ({ newFolder, roms }: { newFolder: Folder; roms: Roms }) => {
        setIsSyncing(false);
        setFolders((folders) => {
          return {
            ...folders,
            [newFolder.id]: newFolder
          };
        });
        setRoms(roms);
        router.push(`/${newFolder.id}`);
      }
    );
  };

  const scrapeFolder = (folder: Folder, all: boolean) => {
    window.ipc.send("scrape_folder", {
      folder,
      all
    });
    window.ipc.on("new_data", (d: Roms["id"]) => {
      setRoms((r) => ({
        ...r,
        [d.id]: d
      }));
    });
  };

  const setFolderMatch = ({ id, name }) => {
    setFolderMatches([
      ...folderMatches.filter((a) => a.name !== name),
      {
        ...folderMatches.find((a) => a.name === name),
        console: consoles.find((c) => c.id === id)
      }
    ]);
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        addFolder,
        scrapeFolder,
        syncFolders,
        isSyncing,
        folderMatches,
        isLoading,
        setFolderMatch
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

function useFolders() {
  const context = React.useContext(FoldersContext);
  if (context === undefined) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
}

export { FolderProvider, useFolders };
