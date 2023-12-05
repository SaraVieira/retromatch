import * as React from "react";
import { Folder, RomFolder, RomFolders } from "../../types";
import { useRouter } from "next/router";

const FoldersContext = React.createContext({
  folders: {} as RomFolders,
  addFolder: (_: RomFolder) => {},
  scrapeFolder: (folder: Folder, mainFolder: RomFolder, all: boolean) => {},
  isSyncing: false,
  isLoading: false,
});

function FolderProvider({ children }) {
  const [folders, setFolders] = React.useState({});
  const [isSyncing, setIsSyncing] = React.useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

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
    setIsSyncing(true);
    window.ipc.send("add_folder", folder);
    getData();
    syncFolder(folder);
  };

  const syncFolder = (folder: RomFolder) => {
    window.ipc.send("sync_folder", {
      path: folder.path,
      id: folder.id,
    });
    window.ipc.on("done_syncing", (newFolder: Folder) => {
      setIsSyncing(false);
      setFolders((folders) => {
        return {
          ...folders,
          [newFolder.id]: newFolder,
        };
      });
      router.push(`/${newFolder.id}`);
    });
  };

  const scrapeFolder = (
    folder: Folder,
    mainFolder: RomFolder,
    all: boolean
  ) => {
    window.ipc.send("scrape_folder", {
      folder,
      mainFolder,
      all,
    });
    window.ipc.on("new_data", (d: RomFolder) => {
      setFolders((f) => ({
        ...f,
        [d.id]: d,
      }));
    });
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        addFolder,
        scrapeFolder,
        isSyncing,
        isLoading,
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
