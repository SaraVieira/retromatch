import Image from "next/image";
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
        <div className="grid">
          {activeFile?.info?.images?.screenshots?.length > 0 &&
            activeFile.info.images?.screenshots.map((screenshot) => (
              <Image
                key={screenshot}
                src={screenshot}
                height={250}
                width={330}
                alt={`${activeFile?.info?.title} screenshot`}
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
                className=" max-w-full mx-auto"
              />
            ))}
        </div>
        <pre>{JSON.stringify(activeFile, null, 2)}</pre>
      </div>
    </>
  );
};

export default Files;
