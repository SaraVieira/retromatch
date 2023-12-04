import Link from "next/link";
import { useFolders } from "../../../../hooks/folder-context";
import { useRouter } from "next/router";

export const Files = () => {
  const { folders } = useFolders();
  const { query } = useRouter();

  const activeFile =
    folders[query.folder as string]?.folders[query.path as string].files[
      query.file as string
    ];

  return (
    <div className="container mx-auto">
      <video src={activeFile?.info?.videos?.shortplay} controls />{" "}
      <pre>{JSON.stringify(activeFile, null, 2)}</pre>
    </div>
  );
};

export default Files;
