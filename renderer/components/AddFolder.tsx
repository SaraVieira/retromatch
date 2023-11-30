import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useFolders } from "../hooks/folder-context";

export const AddFolder = () => {
  const [path, setPath] = useState("");
  const [consoleS, setConsole] = useState("");
  const [name, setName] = useState("");
  const { addFolder } = useFolders();

  const openFolder = () => {
    window.ipc.send("open-dialog-folder", null);

    window.ipc.on("folder_path", (path: string) => setPath(path));
  };

  return (
    <div className="grow flex flex-col justify-center items-center gap-4">
      <h1 className="bold text-xl">Add a new rom folder</h1>
      {!path ? (
        <Button onClick={openFolder}>Select a folder</Button>
      ) : (
        <div className="flex-col flex gap-4 min-w-[500px]">
          <Input isReadOnly label="Path" value={path} />
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Console"
            value={consoleS}
            onChange={(e) => setConsole(e.target.value)}
          />
          <Button
            color="primary"
            isLoading={false}
            onClick={() =>
              addFolder({
                name,
                path,
                console: consoleS,
                configFilePath: `${path}/retromatch.json`,
              })
            }
            isDisabled={!consoleS || !name || !path}
          >
            Add new folder and scan
          </Button>
        </div>
      )}
    </div>
  );
};
