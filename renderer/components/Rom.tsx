import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Tooltip
} from "@nextui-org/react";
import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { humanFileSize } from "../utils/size";

export const Rom = ({ rom }) => {
  const { query } = useRouter();
  return (
    <Link className="text-sm" href={`/${query.folder}/${query.path}/${rom.id}`}>
      <Card
        isPressable
        isHoverable
        shadow="sm"
        className="h-full flex flex-col justify-between rounded-lg"
      >
        <CardHeader className="flex flex-col items-start gap-1">
          <Link
            className="text-sm"
            href={`/${query.folder}/${query.path}/${rom.id}`}
          >
            {rom.info?.title || rom.name}
          </Link>
          <div className="flex justify-between items-center w-full">
            {rom?.info?.rating ? (
              <Tooltip
                showArrow={true}
                content={`${rom?.info.rating / 20} / 5`}
              >
                <div className="flex gap-1">
                  {rom?.info?.rating / 20 >= 1 ? (
                    <IconStarFilled className="text-yellow-400 w-3 h-3" />
                  ) : (
                    <IconStar className="text-yellow-400 w-3 h-3" />
                  )}
                  {rom?.info?.rating / 20 >= 2 ? (
                    <IconStarFilled className="text-yellow-400 w-3 h-3" />
                  ) : (
                    <IconStar className="text-yellow-400 w-3 h-3" />
                  )}
                  {rom?.info?.rating / 20 >= 3 ? (
                    <IconStarFilled className="text-yellow-400 w-3 h-3" />
                  ) : (
                    <IconStar className="text-yellow-400 w-3 h-3" />
                  )}
                  {rom?.info?.rating / 20 > 4 ? (
                    rom?.info?.rating / 20 >= 4.5 ? (
                      <IconStarFilled className="text-yellow-400 w-3 h-3" />
                    ) : (
                      <IconStarHalfFilled className="text-yellow-400 w-3 h-3" />
                    )
                  ) : (
                    <IconStar className="text-yellow-400 text-xs h-3 w-3" />
                  )}
                </div>
              </Tooltip>
            ) : null}
            <span className="text-sm text-content4">{rom?.info?.released}</span>
          </div>
        </CardHeader>

        <CardBody>
          {rom.info?.images ? (
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
