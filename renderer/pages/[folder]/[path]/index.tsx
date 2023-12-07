import Link from "next/link";
import { useRouter } from "next/router";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { IconReload } from "@tabler/icons-react";

import { useFolders } from "../../../hooks/folder-context";
import { humanFileSize } from "../../../utils/size";

export const Files = () => {
  const { folders, scrapeFolder } = useFolders();
  const { query } = useRouter();

  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];

  const scrape = () => {
    scrapeFolder(activeFolder, folders[query.folder as string], true);
  };

  const files = Object.values(activeFolder?.files || {});
  if (files.length === 0) {
    return (
      <div className="container mx-auto flex justify-center">
        <button onClick={() => scrape()}>
          <Card>
            <CardHeader>
              <h2>No ROMs found</h2>
            </CardHeader>

            <CardBody className="text-xs text-center">
              <IconReload className="mx-auto mb-4" />
              Scan again?
            </CardBody>
          </Card>
        </button>
      </div>
    );
  }

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
