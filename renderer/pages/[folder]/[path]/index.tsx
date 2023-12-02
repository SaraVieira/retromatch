import Link from "next/link";
import { useFolders } from "../../../hooks/folder-context";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { humanFileSize } from "../../../utils/size";
import { RomFolder } from "../../../../types";

export const Files = () => {
  const { folders, scrapeFolder } = useFolders();
  const { query } = useRouter();

  const activeFolder = useMemo(() => {
    return folders
      ?.find((f) => f.name === query.folder)
      ?.folders?.find((f) => f.console.id === query.path);
  }, [folders]);

  const scrape = () => {
    scrapeFolder(
      activeFolder,
      folders?.find((f) => f.name === query.folder).path as string
    );
  };

  console.log(folders?.find((f) => f.name === query.folder));

  return (
    <div className="container mx-auto">
      <Link href={`/${query.folder}`}>Go back</Link>
      <div>
        <Button onClick={scrape}>Scrape Folder</Button>
      </div>
      <ul className="py-8 grid grid-cols-2 gap-4">
        {(activeFolder?.files || []).map((f) => (
          <li>
            <Card>
              <CardHeader>{f.info?.title || f.name}</CardHeader>
              <img src={f.info?.images?.cover} alt={f.name} />
              <CardBody className="text-xs text-content4">
                {humanFileSize(f.size)}
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
