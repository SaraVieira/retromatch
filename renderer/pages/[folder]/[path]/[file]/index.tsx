import { useRouter } from "next/router";
import { useRoms } from "../../../../hooks/roms-context";

export const Files = () => {
  const { query } = useRouter();
  const { roms } = useRoms();

  const activeFile = roms[query.file as string];

  return (
    <div className="container mx-auto">
      <video src={activeFile?.info?.videos?.shortplay} controls />
      <pre>{JSON.stringify(activeFile, null, 2)}</pre>
    </div>
  );
};

export default Files;
