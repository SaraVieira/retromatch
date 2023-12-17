import Image from "next/image";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

import { Roms } from "../../types";
import { humanFileSize } from "../utils/size";

export const RomDuplicate = ({
  rom,
  onClick
}: {
  rom: Roms[0];
  onClick: () => void;
}) => {
  return (
    <Card
      isPressable
      isHoverable
      onPress={onClick}
      shadow="sm"
      className="h-full flex flex-col justify-between rounded-lg w-[280px]"
    >
      <CardHeader className="flex flex-col items-start gap-1 text-sm text-left">
        {rom.name}
        {rom.extension}
      </CardHeader>

      <CardBody>
        {rom.info?.images?.cover || rom.info?.images?.title ? (
          <Image
            src={rom.info?.images?.cover || rom.info?.images?.title}
            alt={rom.name}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
            width={125}
            height={175}
            className=" max-w-full mx-auto"
          />
        ) : null}
      </CardBody>
      <CardFooter className="text-xs text-content4 flex justify-between">
        <span>{humanFileSize(rom.size)}</span>
        <span>Extension: {rom.extension}</span>
      </CardFooter>
    </Card>
  );
};
