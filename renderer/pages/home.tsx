import React from "react";
import { useFolders } from "../hooks/folder-context";
import { AddFolder } from "../components/AddFolder";

export default function HomePage() {
  const { folders } = useFolders();
  console.log(folders);
  if (!folders.length) {
    return <AddFolder />;
  }

  return <div>yas</div>;
}
