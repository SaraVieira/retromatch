import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { IconChevronLeft } from "@tabler/icons-react";
import { useFolders } from "../hooks/folder-context";
import { ScrapeButton } from "./ScrapeButton";

export default function Header() {
  const { pathname, query } = useRouter();
  const { folders } = useFolders();
  const isConsolePage = query.folder && query.path && !query.file;
  const isVolumePage = query.folder && !query.path && !query.file;

  const createBackLink = () => {
    if (query.folder && query.path && query.file) {
      return `/${query.folder}/${query.path}`;
    }
    if (isConsolePage) {
      return `/${query.folder}`;
    }

    return "/";
  };

  const activeFolder =
    folders[query.folder as string]?.folders?.[query.path as string];

  return (
    <Navbar isBordered maxWidth="xl" className="min-h-[66px]">
      <NavbarBrand>
        {pathname !== "/" ? (
          <Button
            as={Link}
            href={createBackLink()}
            className="mr-4"
            isIconOnly
            variant="ghost"
          >
            <IconChevronLeft />
          </Button>
        ) : null}
        <p className="font-bold text-inherit">
          RETROMATCH
          {isConsolePage && ` / ${activeFolder?.console?.name}`}
          {isVolumePage && ` / ${folders[query.folder as string]?.name}`}
        </p>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem className="flex gap-4">
          {isConsolePage && <ScrapeButton />}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
