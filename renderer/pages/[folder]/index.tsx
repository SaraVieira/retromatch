import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { IconReload } from "@tabler/icons-react";

import { useFolders } from "../../hooks/folder-context";

export default function HomePage() {
  const { folders, syncFolder } = useFolders();
  const { query } = useRouter();
  const subFolders = folders[query.folder as string]?.folders;
  const gameFolders = subFolders
    ? Object.values(subFolders).filter((a) => Object.values(a.files).length)
    : [];

  if (!gameFolders || gameFolders.length === 0) {
    return (
      <div className="container mx-auto flex justify-center">
        <button onClick={() => syncFolder(folders[query.folder as string])}>
          <Card>
            <CardHeader>
              <h2>No ROM folders found</h2>
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
      <ul className="grid grid-cols-3 gap-4 py-8">
        {folders[query.folder as string]?.folders &&
          gameFolders.map((f) => (
            <li className="w-[200px] h-full" key={f.id}>
              <Link href={`/${query.folder}/${f.id}`} className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <div>
                      <h2>{f.console.name}</h2>
                      <span className="text-sm text-default-400">
                        {Object.values(f.files).length} file
                        {Object.values(f.files).length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardBody className="text-xs text-content4 justify-end">
                    {f.console.image ? (
                      <img
                        src={`/images/consoles/${f.console.image}`}
                        alt={f.console.name}
                        className="max-w-full"
                      />
                    ) : null}
                  </CardBody>
                  <CardFooter>
                    <span className="text-sm text-default-500 truncate">
                      {f.path}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
