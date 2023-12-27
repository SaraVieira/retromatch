import Image from "next/image";
import { useRouter } from "next/router";
import { Item, Menu, useContextMenu } from "react-contexify";

import { Card, CardBody, CardFooter, CardHeader, cn } from "@nextui-org/react";

import { Roms } from "../../../types";
import { useRoms } from "../../hooks/roms-context";
import { humanFileSize } from "../../utils/size";
import { Rating } from "./Rating";

export const Rom = ({
  rom,
  screenscrapperId
}: {
  rom: Roms[0];
  screenscrapperId: number;
}) => {
  const { query } = useRouter();
  const router = useRouter();
  const { scrapeRom } = useRoms();
  const MENU_ID = `rom_context_menu_${rom.id}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  const handleContextMenu = (event) =>
    show({
      event
    });

  return (
    <button onContextMenu={handleContextMenu} className="w-full">
      <Menu id={MENU_ID}>
        <Item
          id="scrape"
          onClick={() => {
            scrapeRom(rom, screenscrapperId);
            hideAll();
          }}
        >
          Scrape Rom
        </Item>
      </Menu>
      <Card
        as={"div"}
        onClick={() => router.push(`/${query.folder}/${query.path}/${rom.id}`)}
        onContextMenu={handleContextMenu}
        isPressable
        isHoverable
        shadow="sm"
        className={cn(
          `h-full flex flex-col justify-between rounded-lg w-full`,
          rom.isDuplicate ? "border-2 border-rose-600" : ""
        )}
      >
        <CardHeader className="flex flex-col items-start gap-1">
          <span className="text-sm text-left">
            {rom.info?.title || rom.name}
          </span>
          <div className="flex justify-between items-center w-full">
            <Rating rating={rom?.info?.rating} />
            <span className="text-sm text-content4">{rom?.info?.released}</span>
          </div>
        </CardHeader>

        <CardBody>
          {rom.info?.images?.cover || rom.info?.images?.title ? (
            <Image
              src={rom.info?.images?.cover || rom.info?.images?.title}
              alt={rom.name}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
              width={250}
              height={330}
              className=" max-w-full mx-auto"
            />
          ) : null}
        </CardBody>
        <CardFooter className="text-xs text-content4">
          {humanFileSize(rom.size)}
        </CardFooter>
      </Card>
    </button>
  );
};
