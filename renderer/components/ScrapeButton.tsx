import { useRouter } from "next/router";
import { useState } from "react";
import { useFolders } from "../hooks/folder-context";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from "@nextui-org/react";
import { IconChevronDown } from "@tabler/icons-react";

export const ScrapeButton = () => {
  const [selectedOption, setSelectedOption] = useState(new Set(["all"]));
  const { query } = useRouter();
  const { folders, scrapeFolder } = useFolders();

  const selectedOptionValue = Array.from(selectedOption)[0];

  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];

  const scrape = () =>
    scrapeFolder(activeFolder, selectedOptionValue === "all");

  const descriptionsMap = {
    all: "Scrape all roms in this folder",
    missing: "Only roms with no info will be scraped"
  };

  const labelsMap = {
    all: "Scrape all",
    missing: "Only missing"
  };

  return (
    <ButtonGroup variant="flat">
      <Button onClick={scrape}>{labelsMap[selectedOptionValue]}</Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly>
            <IconChevronDown />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          selectedKeys={selectedOption}
          selectionMode="single"
          //@ts-expect-error
          onSelectionChange={setSelectedOption}
          className="max-w-[300px]"
        >
          <DropdownItem key="all" description={descriptionsMap["all"]}>
            {labelsMap["all"]}
          </DropdownItem>
          <DropdownItem key="missing" description={descriptionsMap["missing"]}>
            {labelsMap["missing"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
};
