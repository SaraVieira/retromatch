import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { consoles } from "../../consoles";
import { Folder, RomFolder, RomFolders, Roms } from "../../types";
import { useRoms } from "./roms-context";

const FoldersContext = createContext({
  folders: {} as RomFolders,
  addFolder: (_: RomFolder) => {},
  scrapeFolder: (_folder: Folder, _all: boolean) => {},
  syncFolders: () => {},
  isSyncing: false,
  isLoading: false,
  folderMatches: [],
  deleteFolder: (_id: string) => {},
  // eslint-disable-next-line
  setFolderMatch: ({ id, name }: { id: string; name: string }) => {}
});

function FolderProvider({ children }) {
  const [folders, setFolders] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [folderMatches, setFolderMatches] = useState([]);
  const { setRoms, roms } = useRoms();
  const [selectedFolder, setSelectedFolder] = useState({});

  const getData = () => {
    setIsLoading(true);
    window.ipc.on("all_data", (folders: RomFolders[]) => {
      setFolders(folders);
      setIsLoading(false);
    });

    window.ipc.send("load", null);
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteFolder = (id: string) => {
    window.ipc.send("delete_folder", id);
    getData();
  };
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
      setRoms({
        ...roms,
        [d.id]: d
      });
    });
  };

  const setFolderMatch = ({ id, name }) => {
    setFolderMatches(
      folderMatches.map((f) => {
        if (f.name === name) {
          return {
            ...f,
            console: consoles.find((c) => c.id === id)
          };
        }
        return f;
      })
    );
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
        setFolderMatch,
        deleteFolder
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
}

function useFolders() {
  const context = useContext(FoldersContext);
  if (context === undefined) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
}

export { FolderProvider, useFolders };
