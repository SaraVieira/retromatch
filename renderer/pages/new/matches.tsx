import { consoles } from "../../../consoles";
import { useFolders } from "../../hooks/folder-context";
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Button,
  Spinner
} from "@nextui-org/react";

const SingleItem = ({ folder }) => {
  const { setFolderMatch } = useFolders();
  return (
    <div className="flex items-center justify-between mb-4" key={folder.name}>
      <div className="flex flex-col gap-1">
        <span>{folder.name}</span>
        <span className="text-sm text-default-500 truncate">{folder.path}</span>
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
  );
};

const Matches = () => {
  const { folderMatches, isSyncing, syncFolders } = useFolders();

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
        <Accordion defaultExpandedKeys={["1"]}>
          <AccordionItem
            key="1"
            aria-label="No Matches Found"
            title="No Matches Found"
          >
            {folderMatches
              .filter((f) => !f.console)
              .map((folder) => (
                <SingleItem key={folder.id} folder={folder} />
              ))}
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Console Matches Found"
            title="Console Matches Found"
          >
            {folderMatches
              .filter((f) => f.console)
              .map((folder) => (
                <SingleItem key={folder.id} folder={folder} />
              ))}
          </AccordionItem>
        </Accordion>
        <Button onClick={syncFolders} color="primary" className="mt-8">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Matches;
