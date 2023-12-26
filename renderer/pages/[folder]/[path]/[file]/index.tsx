import { useRouter } from "next/router";

import { useRoms } from "../../../../hooks/roms-context";

export const Files = () => {
  const { query } = useRouter();
  const { roms } = useRoms();

  const activeFile = roms[query.file as string];

  return (
    <>
      <div
        className="backdrop-saturate-150 bg-background/90 backdrop-blur-sm -mt-6 -ml-6 p-6 border-b border-divider w-screen sticky top-0 z-[99] overflow-hidden"
        style={{
          height: 90,
          width: "calc(100% + 3rem)"
        }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold"> {activeFile?.info?.title}</h1>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <video src={activeFile?.info?.videos?.shortplay} controls />
        <pre>{JSON.stringify(activeFile, null, 2)}</pre>
      </div>
    </>
  );
};

export default Files;
