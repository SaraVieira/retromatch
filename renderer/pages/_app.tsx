import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider, cn } from "@nextui-org/react";
import "../styles/globals.css";
import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { IconCopy, IconEdit, IconFile, IconTrash } from "@tabler/icons-react";

const ListboxWrapper = ({ children }) => (
  <div className=" w-[300px] border-small px-1 py-2 border-default-200 dark:border-default-100 h-screen">
    {children}
  </div>
);

const animals = [
  {
    label: "Cat",
    value: "cat",
    description: "The second most popular pet in the world",
  },
  {
    label: "Dog",
    value: "dog",
    description: "The most popular pet in the world",
  },
  {
    label: "Elephant",
    value: "elephant",
    description: "The largest land animal",
  },
  { label: "Lion", value: "lion", description: "The king of the jungle" },
  { label: "Tiger", value: "tiger", description: "The largest cat species" },
  {
    label: "Giraffe",
    value: "giraffe",
    description: "The tallest land animal",
  },
  {
    label: "Dolphin",
    value: "dolphin",
    description: "A widely distributed and diverse group of aquatic mammals",
  },
  {
    label: "Penguin",
    value: "penguin",
    description: "A group of aquatic flightless birds",
  },
  {
    label: "Zebra",
    value: "zebra",
    description: "A several species of African equids",
  },
  {
    label: "Shark",
    value: "shark",
    description:
      "A group of elasmobranch fish characterized by a cartilaginous skeleton",
  },
  {
    label: "Whale",
    value: "whale",
    description: "Diverse group of fully aquatic placental marine mammals",
  },
  {
    label: "Otter",
    value: "otter",
    description: "A carnivorous mammal in the subfamily Lutrinae",
  },
  {
    label: "Crocodile",
    value: "crocodile",
    description: "A large semiaquatic reptile",
  },
];
function MyApp({ Component, pageProps }: AppProps) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <NextUIProvider>
      <div className="flex gap-2">
        <div className="">
          <Autocomplete
            label="Select a folder"
            className="w-full px-2 border-r-small border-default-200 dark:border-default-100"
            variant="underlined"
          >
            {animals.map((animal) => (
              <AutocompleteItem key={animal.value} value={animal.value}>
                {animal.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
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
        <Component {...pageProps} />
      </div>
    </NextUIProvider>
  );
}

export default MyApp;
