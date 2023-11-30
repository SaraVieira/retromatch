import * as React from "react";
import { RomFolder, RomFolders } from "../../types";

const FoldersContext = React.createContext({
  folders: [] as RomFolders,
  currentFolder: {} as RomFolder,
  addFolder: (_: RomFolder) => {},
});

function FolderProvider({ children }) {
  const [folders, setFolders] = React.useState([]);
  const [currentFolder, setCurrentFolder] = React.useState(folders[0] || {});

  const getData = () => {
    window.ipc.on("all_data", (folders: RomFolders[]) => {
      setFolders(folders);
      setCurrentFolder(folders[0]);
    });

    window.ipc.send("load", null);
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

  return (
    <FoldersContext.Provider
      value={{
        folders,
        addFolder,
        currentFolder,
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
