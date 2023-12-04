import { Spinner } from "@nextui-org/react";
import { AddFolder } from "../components/AddFolder";
import { useFolders } from "../hooks/folder-context";
import Link from "next/link";

const New = () => {
  const { isSyncing } = useFolders();

  if (isSyncing) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <h1>Syncing info</h1>
        <Spinner />
      </div>
    );
  }
  return (
    <>
      {" "}
      <Link href={"/"}>Go back</Link>
      <AddFolder />
    </>
  );
};

export default New;
