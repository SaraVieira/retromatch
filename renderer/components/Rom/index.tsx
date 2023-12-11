import { Card, CardBody, CardFooter, CardHeader, cn } from "@nextui-org/react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { humanFileSize } from "../../utils/size";
import { Rating } from "./Rating";
import { Roms } from "../../../types";

export const Rom = ({ rom }: { rom: Roms[0] }) => {
  const { query } = useRouter();
  return (
    <Link className="text-sm" href={`/${query.folder}/${query.path}/${rom.id}`}>
      <Card
        isPressable
        isHoverable
        shadow="sm"
        className={cn(
          `h-full flex flex-col justify-between rounded-lg w-[280px]`,
          rom.isDuplicate ? "border-2 border-rose-600" : ""
        )}
      >
        <CardHeader className="flex flex-col items-start gap-1">
          <Link
            className="text-sm text-left"
            href={`/${query.folder}/${query.path}/${rom.id}`}
          >
            {rom.info?.title || rom.name}
          </Link>
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
    </Link>
  );
};
