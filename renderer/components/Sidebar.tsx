import { Listbox, ListboxItem, ListboxSection, cn } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { IconCopy, IconEdit, IconFile, IconTrash } from "@tabler/icons-react";
import { useFolders } from "../hooks/folder-context";

const ListboxWrapper = ({ children }) => (
  <div className=" w-[300px] border-small px-1 py-2 border-default-200 dark:border-default-100 h-screen">
    {children}
  </div>
);

export const Sidebar = () => {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const { folders } = useFolders();
  console.log(folders);
  return (
    <div className="">
      {folders.length && (
        <Autocomplete
          label="Select a folder"
          className="w-full px-2 border-r-small border-default-200 dark:border-default-100"
          variant="underlined"
        >
          {folders.map((folder) => (
            <AutocompleteItem key={folder.path} value={folder.path}>
              {folder.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      )}
      <ListboxWrapper>
        <Listbox variant="flat" aria-label="Listbox menu with sections">
          <ListboxSection title="Actions" showDivider>
            <ListboxItem
              key="new"
              description="Create a new file"
              startContent={<IconFile className={iconClasses} />}
            >
              New file
            </ListboxItem>
            <ListboxItem
              key="copy"
              description="Copy the file link"
              startContent={<IconCopy className={iconClasses} />}
            >
              Copy link
            </ListboxItem>
            <ListboxItem
              key="edit"
              description="Allows you to edit the file"
              startContent={<IconEdit className={iconClasses} />}
            >
              Edit file
            </ListboxItem>
          </ListboxSection>
          <ListboxSection title="Danger zone">
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Permanently delete the file"
              startContent={
                <IconTrash className={cn(iconClasses, "text-danger")} />
              }
            >
              Delete file
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};
