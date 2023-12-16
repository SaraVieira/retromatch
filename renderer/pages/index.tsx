import React, { useEffect } from "react";
import { useFolders } from "../hooks/folder-context";

import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/router";
import { IconFolder, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { humanFileSize } from "../utils/size";
import { Folder } from "../components/Folders/Folder";

export default function HomePage() {
  const { folders, isLoading } = useFolders();
  const router = useRouter();

  useEffect(() => {
    if (!Object.keys(folders).length && router.isReady && !isLoading) {
      router.push("/new");
    }
  }, [router.isReady, folders, isLoading]);

  return (
    <div className="container mx-auto">
      <ul className="flex items-stretch flex-wrap gap-4 py-8">
        {Object.values(folders).map((f) => (
          <Folder key={f.id} folder={f} />
        ))}
        <li className="w-[200px] h-full">
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
