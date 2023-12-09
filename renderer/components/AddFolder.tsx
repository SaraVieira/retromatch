import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useFolders } from "../hooks/folder-context";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";

export const createID = () => {
  const lowercaseRandomString = customAlphabet(alphanumeric, 10);

  return `a${lowercaseRandomString()}`;
};

export const AddFolder = () => {
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const { addFolder } = useFolders();

  const openFolder = () => {
    window.ipc.send("open-dialog-folder", null);

    window.ipc.on("folder_path", setPath);
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
          <Button
            color="primary"
            isLoading={false}
            onClick={() =>
              addFolder({
                id: createID(),
                name,
                path,
                configFilePath: `${path}/retromatch.json`
              })
            }
            isDisabled={!name || !path}
          >
            Add new folder and scan
          </Button>
        </div>
      )}
    </div>
  );
};
