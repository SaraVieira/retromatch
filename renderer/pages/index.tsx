import React, { useEffect } from "react";
import { useFolders } from "../hooks/folder-context";

import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";

export default function HomePage() {
  const { folders, isLoading } = useFolders();
  const router = useRouter();

  useEffect(() => {
    if (!Object.keys(folders).length && router.isReady && !isLoading) {
      router.push("/new");
    }
  }, [router.isReady, folders, isLoading]);

  const onClick = (file: { path: string; id: string }) =>
    router.push(`/${file.id}`);

  return (
    <div className="container mx-auto">
      <ul className="flex items-stretch flex-wrap gap-4 py-8">
        {Object.values(folders).map((f) => (
          <li className="w-[200px]" key={f.id}>
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
