import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useFolders } from "../../hooks/folder-context";
import { useRouter } from "next/router";

export default function HomePage() {
  const { folders } = useFolders();
  const { query, isReady } = useRouter();
  const currentFolder = useMemo(() => {
    if (!isReady) {
      return null;
    }

    return folders[query.folder as string];
  }, [folders, isReady]);

  return (
    <div className="container mx-auto">
      <ul className="grid grid-cols-3 gap-4 py-8">
        {folders[query.folder as string]?.folders &&
          Object.values(folders[query.folder as string]?.folders)
            .filter((a) => Object.values(a.files).length)
            .map((f) => (
              <li className="w-[200px]" key={f.id}>
                <Link href={`/${query.folder}/${f.id}`}>
                  <Card>
                    <CardHeader>
                      <div>
                        <h2>{f.console.name}</h2>
                        <span className="text-sm text-default-400">
                          {Object.values(f.files).length} file
                          {Object.values(f.files).length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </CardHeader>

                    <CardBody className="text-xs text-content4">
                      {f.console.image ? (
                        <img
                          src={`/images/consoles/${f.console.image}`}
                          alt={f.console.name}
                          className="max-w-full"
                        />
                      ) : null}
                    </CardBody>
                    <CardFooter>
                      <span className="text-sm text-default-500">{f.path}</span>
                    </CardFooter>
                  </Card>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
