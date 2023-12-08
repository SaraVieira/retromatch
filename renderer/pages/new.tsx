import { Progress, Spinner } from "@nextui-org/react";
import { AddFolder } from "../components/AddFolder";
import { useFolders } from "../hooks/folder-context";
import Link from "next/link";
import { useEffect, useState } from "react";

const New = () => {
  const { isSyncing } = useFolders();
  const [progress, setProgress] = useState();

  useEffect(() => {
    window.ipc.addListener("sync_progress", setProgress);
  }, []);

  if (isSyncing) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1>Syncing info</h1>
        {progress ? (
          <Progress
            label={`Syncing ${progress.current} / ${progress.total}...`}
            value={(progress.current / progress.total) * 100}
            className="max-w-md"
          />
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
  return (
    <>
      <AddFolder />
    </>
  );
};

export default New;
