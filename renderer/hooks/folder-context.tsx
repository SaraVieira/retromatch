import * as React from "react";
import { RomFolder, RomFolders } from "../../types";

const FoldersContext = React.createContext({
  folders: [],
  addFolder: (_: RomFolder) => {},
});

function FolderProvider({ children }) {
  const [folders, setFolders] = React.useState([]);

  const getData = () => {
    window.ipc.on("all_data", (folders: RomFolders[]) => setFolders(folders));

    window.ipc.send("load", null);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const addFolder = (folder: RomFolder) => {
    window.ipc.send("add_folder", folder);
    getData();
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        addFolder,
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
