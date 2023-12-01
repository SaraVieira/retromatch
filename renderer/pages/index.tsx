import React, { useEffect } from "react";
import { useFolders } from "../hooks/folder-context";
import { AddFolder } from "../components/AddFolder";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import Link from "next/link";

export default function HomePage() {
  const { folders, currentFolder } = useFolders();

  if (!folders.length) {
    return <AddFolder />;
  }

  if (!currentFolder?.lastSynced) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1>Syncing info for {currentFolder.name}</h1>
        <Spinner />
      </div>
    );
  }

  console.log(currentFolder);

  return (
    <div>
      <ul className="flex items-stretch flex-wrap gap-4 py-8">
        {currentFolder.folders
          .filter((a) => a.files.length)
          .map((f) => (
            <li className="w-[200px]">
              <Link href={`/${f.console.id}`}>
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
