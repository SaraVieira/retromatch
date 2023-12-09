import Link from "next/link";
import { useFolders } from "../../../hooks/folder-context";
import { useRouter } from "next/router";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { humanFileSize } from "../../../utils/size";
import { useRoms } from "../../../hooks/roms-context";

export const Files = () => {
  const { folders } = useFolders();
  const { roms } = useRoms();
  const { query } = useRouter();

  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];
  if (!activeFolder) return null;

  return (
    <div className="container mx-auto">
      <ul className="py-8 grid grid-cols-4 gap-4 items-stretch">
        {Object.values(activeFolder?.files || {}).map(
          (f) =>
            roms[f] && (
              <li key={roms[f].id}>
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <Link href={`/${query.folder}/${query.path}/${roms[f].id}`}>
                      {roms[f].info?.title || roms[f].name}
                    </Link>
                  </CardHeader>

                  <CardBody>
                    {roms[f].info?.images ? (
                      <img
                        src={
                          roms[f].info?.images?.cover ||
                          roms[f].info?.images?.title
                        }
                        alt={roms[f].name}
                        className=" max-w-full mx-auto"
                      />
                    ) : null}
                  </CardBody>
                  <CardFooter className="text-xs text-content4">
                    {humanFileSize(roms[f].size)}
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
