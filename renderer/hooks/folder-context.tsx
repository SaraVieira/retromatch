import * as React from "react";
import { Folder, RomFolder, RomFolders } from "../../types";

const FoldersContext = React.createContext({
  folders: [] as RomFolders,
  currentFolder: {} as RomFolder,
  addFolder: (_: RomFolder) => {},
  setCurrentFolder: (path: string) => {},
  scrapeFolder: (folder: Folder, path: string) => {},
});

function FolderProvider({ children }) {
  const [folders, setFolders] = React.useState([]);
  const [currentFolder, setCurrentFolderA] = React.useState(folders[0] || {});

  const getData = () => {
    window.ipc.on("all_data", (folders: RomFolders[]) => setFolders(folders));

    window.ipc.send("load", null);
  };

  const setCurrentFolder = (path) => {
    setCurrentFolderA(folders[path]);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const addFolder = (folder: RomFolder) => {
    window.ipc.send("add_folder", folder);
    getData();
    syncFolder(folder);
  };

  const syncFolder = (folder: RomFolder) => {
    window.ipc.send("sync_folder", folder.path);
    window.ipc.on("new_current_folder", setCurrentFolder);
  };

  const scrapeFolder = (folder: Folder, path: string) => {
    window.ipc.send("scrape_folder", {
      folder,
      path,
    });
    window.ipc.on("new_data", (d: RomFolder) =>
      setFolders((f) => [...f.filter((a) => a.name !== d.name), d])
    );
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        addFolder,
        currentFolder,
        setCurrentFolder,
        scrapeFolder,
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
