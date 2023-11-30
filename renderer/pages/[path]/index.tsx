import Link from "next/link";
import { useFolders } from "../../hooks/folder-context";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const Files = () => {
  const { folders, currentFolder } = useFolders();
  const { query } = useRouter();

  const activeFolder = useMemo(
    () => currentFolder.folders.find((f) => f.console.id === query.path),
    [currentFolder]
  );

  return (
    <div>
      <Link href={"/"}>Go back</Link>
      <ul className="py-8">
        {activeFolder.files.map((f) => (
          <li>{f}</li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
