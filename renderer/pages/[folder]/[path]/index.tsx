import Link from "next/link";
import { useRouter } from "next/router";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { IconReload } from "@tabler/icons-react";

import { useFolders } from "../../../hooks/folder-context";
import { useRoms } from "../../../hooks/roms-context";
import { humanFileSize } from "../../../utils/size";

export const Files = () => {
  const { folders, scrapeFolder } = useFolders();
  const { roms } = useRoms();
  const { query } = useRouter();

  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];

  const scrape = () => {
    scrapeFolder(activeFolder, true);
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

  const filenames = Object.values(activeFolder.files || {});

  const games = filenames.map((file) => roms[file]);

  return (
    <div className="container mx-auto">
      <ul className="py-8 grid grid-cols-4 gap-4 items-stretch">
        {games.map(
          (rom) =>
            rom && (
              <li key={rom.id}>
                <Card
                  className={`h-full flex flex-col justify-between${rom.isDuplicate ? " border-2 border-rose-600" : ""
                    }`}
                >
                  <CardHeader>
                    <Link href={`/${query.folder}/${query.path}/${rom.id}`}>
                      {rom.info?.title || rom.name}
                    </Link>
                  </CardHeader>

                  <CardBody>
                    {rom.info?.images ? (
                      <img
                        src={rom.info?.images?.cover || rom.info?.images?.title}
                        alt={rom.name}
                        className=" max-w-full mx-auto"
                      />
                    ) : null}
                  </CardBody>
                  <CardFooter className="text-xs text-content4">
                    {humanFileSize(rom.size)}
                  </CardFooter>
                </Card>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default Files;
