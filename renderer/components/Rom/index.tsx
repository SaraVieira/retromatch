import Image from "next/image";
import { useRouter } from "next/router";
import { Item, Menu, useContextMenu } from "react-contexify";

import { Card, CardBody, CardFooter, CardHeader, cn } from "@nextui-org/react";

import { HLTGame, Roms } from "../../../types";
import { useBacklog } from "../../hooks/backlog-context";
import { useRoms } from "../../hooks/roms-context";
import { humanFileSize } from "../../utils/size";
import { Rating } from "./Rating";

export const Rom = ({
  rom,
  screenscrapperId,
  connected
}: {
  connected: boolean;
  rom: Roms[0];
  screenscrapperId: number;
}) => {
  const { query } = useRouter();
  const router = useRouter();
  const { scrapeRom } = useRoms();
  const { addToBacklog } = useBacklog();
  const MENU_ID = `rom_context_menu_${rom.id}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  const handleContextMenu = (event) =>
    show({
      event
    });

  const image =
    rom.info?.images?.cover ||
    rom.info?.images?.title ||
    rom.info?.images?.screenshots?.[0];

  return (
    <button onContextMenu={handleContextMenu} className="w-full">
      <Menu id={MENU_ID}>
        <Item
          id="add-to-backlog"
          onClick={async () => {
            const res = await fetch(`/api/hltb?game=${rom.info?.title}`);
            const items: HLTGame[] = await res.json();

            if (items.length > 0) {
              await addToBacklog(items[0]);
              router.push("/backlog");
            }
          }}
        >
          Add To Backlog
        </Item>
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
          `@container h-full flex flex-col justify-between rounded-lg w-full`,
          rom.isDuplicate && connected ? "border-2 border-rose-600" : ""
        )}
      >
        <CardHeader className="flex flex-col items-start gap-1">
          <span className="text-sm text-left">
            {rom.info?.title || rom.name}
          </span>
          <div className="@[10rem]:flex justify-between items-center @[10rem]:w-full">
            {rom?.info?.rating ? (
              <Rating rating={rom?.info?.rating} />
            ) : (
              <div />
            )}
            <span className="text-sm text-content4">{rom?.info?.released}</span>
          </div>
        </CardHeader>

        <CardBody>
          {image ? (
            <Image
              src={image}
              alt={rom.name}
              placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
              width={250}
              height={330}
              className="max-w-full mx-auto w-auto h-auto"
            />
          ) : null}
        </CardBody>
        <CardFooter className="text-xs text-content4 block @[10rem]:flex justify-between">
          <span className="@[10rem]:text-left block mb-4 @[10rem]:mb-0">
            {" "}
            {rom.fullName}
          </span>
          <p>{humanFileSize(rom.size)}</p>
        </CardFooter>
      </Card>
    </button>
  );
};
