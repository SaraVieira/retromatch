import React, { useEffect } from "react";
import { useFolders } from "../hooks/folder-context";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useRouter } from "next/router";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

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
            <button className="w-full" onClick={() => onClick(f)}>
              <Card>
                <CardHeader>{f.name}</CardHeader>
                <CardBody className="text-xs text-content4">{f.path}</CardBody>
              </Card>
            </button>
          </li>
        ))}
        <li className="w-[200px]">
          <Link href={"/new"}>
            <Card>
              <CardBody className="flex flex-col gap-4 items-center justify-center">
                <IconPlus />
                Add new
              </CardBody>
            </Card>
          </Link>
        </li>
      </ul>
    </div>
  );
}
