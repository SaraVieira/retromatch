import { consoles } from "../../../consoles";
import { useFolders } from "../../hooks/folder-context";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Spinner
} from "@nextui-org/react";

const Matches = () => {
  const { folderMatches, isSyncing, syncFolders, setFolderMatch } =
    useFolders();

  if (!folderMatches?.length) return null;

  if (isSyncing) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1>Syncing info</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-center text-lg font-bold">Are these correct?</h1>
      <h3 className="text-center text-default-500">
        Please match the folders with consoles
      </h3>
      <div className="mt-12 flex flex-col gap-4 max-w-3xl w-full m-auto">
        {folderMatches.map((folder) => (
          <div className="flex items-center justify-between" key={folder.name}>
            <div className="flex flex-col gap-1">
              <span>{folder.name}</span>
              <span className="text-sm text-default-500 truncate">
                {folder.path}
              </span>
            </div>
            <Autocomplete
              key={folder.name}
              label="Select a console"
              className="max-w-xs"
              selectedKey={folder.console?.id}
              onSelectionChange={(c: string) =>
                setFolderMatch({ id: c, name: folder.name })
              }
            >
              {consoles.map((console) => (
                <AutocompleteItem key={console.id} value={console.id}>
                  {console.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        ))}
        <Button
          onClick={syncFolders}
          color="primary"
          className="mt-8"
          isLoading={false}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Matches;
