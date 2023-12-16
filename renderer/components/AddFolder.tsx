import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Switch,
  cn
} from "@nextui-org/react";
import { useState } from "react";
import { useFolders } from "../hooks/folder-context";
import { customAlphabet } from "nanoid";
import { alphanumeric } from "nanoid-dictionary";
import SDBlack from "./Icons/SDBlack";
import SDGold from "./Icons/SDGold";
import SDSilver from "./Icons/SDSilver";
import SDWhite from "./Icons/SDWhite";
import SDblue from "./Icons/SDBlue";

export const createID = () => {
  const lowercaseRandomString = customAlphabet(alphanumeric, 10);

  return `a${lowercaseRandomString()}`;
};

export const AddFolder = () => {
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const { addFolder } = useFolders();
  const [cardStyle, setCardStyle] = useState("black");
  const [isSD, setIsSD] = useState(true);

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
          <Switch
            isSelected={isSD}
            onValueChange={setIsSD}
            classNames={{
              base: cn(
                "flex flex-row-reverse w-full items-center justify-between cursor-pointer border-transparent min-w-[500px]"
              )
            }}
            defaultSelected
          >
            Is this folder in an SD Card?
          </Switch>
          {isSD ? (
            <RadioGroup
              value={cardStyle}
              onValueChange={setCardStyle}
              label="How does your card look?"
              classNames={{
                label: "text-white mb-2"
              }}
              orientation="horizontal"
            >
              <Radio value="black">
                <SDBlack className="w-7 h-7" />
              </Radio>
              <Radio value="white">
                <SDWhite className="w-7 h-7" />
              </Radio>
              <Radio value="gold">
                <SDGold className="w-7 h-7" />
              </Radio>
              <Radio value="silver">
                <SDSilver className="w-7 h-7" />
              </Radio>
              <Radio value="blue">
                <SDblue className="w-7 h-7" />
              </Radio>
            </RadioGroup>
          ) : null}

          <Button
            color="primary"
            isLoading={false}
            className="mt-8"
            onClick={() =>
              addFolder({
                id: createID(),
                name,
                path,
                sdCard: isSD,
                sdCardStyle: cardStyle,
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
