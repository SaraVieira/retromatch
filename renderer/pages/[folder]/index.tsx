import React, { useMemo } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import Link from "next/link";
import { useFolders } from "../../hooks/folder-context";
import { useRouter } from "next/router";

export default function HomePage() {
  const { folders } = useFolders();
  const { query } = useRouter();

  const currentFolder = useMemo(
    () => folders?.find((f) => f.name === query.folder),
    [folders]
  );

  return (
    <div className="container mx-auto">
      <Link href={"/"}>Go back</Link>
      <ul className="grid grid-cols-3 gap-4 py-8">
        {currentFolder &&
          currentFolder.folders
            .filter((a) => a.files.length)
            .map((f) => (
              <li className="w-[200px]">
                <Link href={`/${currentFolder.name}/${f.console.id}`}>
                  <Card>
                    <CardHeader>
                      {f.console.name} ({f.files.length})
                    </CardHeader>
                    <CardBody className="text-xs text-content4">
                      {f.path}
                    </CardBody>
                  </Card>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
