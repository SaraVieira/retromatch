import React, { useEffect } from "react";
import { useFolders } from "../hooks/folder-context";
import { AddFolder } from "../components/AddFolder";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function HomePage() {
  const { folders, currentFolder, setCurrentFolder } = useFolders();
  const router = useRouter();
  if (!folders.length) {
    return <AddFolder />;
  }

  if (!currentFolder?.lastSynced && currentFolder?.name) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1>Syncing info for {currentFolder.name}</h1>
        <Spinner />
      </div>
    );
  }

  const onClick = (file: { path: string; name: string }) => {
    setCurrentFolder(file.path);
    router.push(`/${file.name}`);
  };

  return (
    <div className="container mx-auto">
      <ul className="flex items-stretch flex-wrap gap-4 py-8">
        {folders.map((f) => (
          <li className="w-[200px]" key={f.path}>
            <button onClick={() => onClick(f)}>
              <Card>
                <CardHeader>{f.name}</CardHeader>
                <CardBody className="text-xs text-content4">{f.path}</CardBody>
              </Card>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
