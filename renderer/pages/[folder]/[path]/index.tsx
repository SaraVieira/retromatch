import Link from "next/link";
import { useFolders } from "../../../hooks/folder-context";
import { useRouter } from "next/router";
import { useMemo } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { humanFileSize } from "../../../utils/size";
import { RomFolder } from "../../../../types";

export const Files = () => {
  const { folders, scrapeFolder } = useFolders();
  const { query } = useRouter();

  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];

  const scrape = () => {
    scrapeFolder(activeFolder, folders[query.folder as string]);
  };

  return (
    <div className="container mx-auto">
      <ul className="py-8 grid grid-cols-4 gap-4 items-stretch">
        {Object.values(activeFolder?.files || {}).map((f) => (
          <li key={f.id}>
            <Card className="h-full flex flex-col justify-between">
              <CardHeader>
                <Link href={`/${query.folder}/${query.path}/${f.id}`}>
                  {f.info?.title || f.name}
                </Link>
              </CardHeader>

              <CardBody>
                {f.info?.images ? (
                  <img
                    src={f.info?.images?.cover || f.info?.images?.title}
                    alt={f.name}
                    className=" max-w-full mx-auto"
                  />
                ) : null}
              </CardBody>
              <CardFooter className="text-xs text-content4">
                {humanFileSize(f.size)}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
