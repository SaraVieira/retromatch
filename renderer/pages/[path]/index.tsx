import Link from "next/link";
import { useFolders } from "../../hooks/folder-context";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { humanFileSize } from "../../utils/size";

export const Files = () => {
  const { currentFolder } = useFolders();
  const { query } = useRouter();

  const activeFolder = useMemo(
    () => currentFolder?.folders?.find((f) => f.console.id === query.path),
    [currentFolder]
  );

  return (
    <div>
      <Link href={"/"}>Go back</Link>
      <ul className="py-8 grid grid-cols-2 gap-4">
        {activeFolder?.files.map((f) => (
          <li>
            <Card>
              <CardHeader>{f.name}</CardHeader>
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
