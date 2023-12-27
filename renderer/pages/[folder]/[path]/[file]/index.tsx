import Image from "next/image";
import { useRouter } from "next/router";

import { useRoms } from "../../../../hooks/roms-context";
import { Rating } from "../../../../components/Rom/Rating";

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
          <div>
            <h1 className="text-xl font-bold mb-2"> {activeFile?.info?.title}</h1>
            <Rating rating={activeFile?.info?.rating} />
          </div>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <div className="flex">
          <div>
            <video src={activeFile?.info?.videos?.shortplay} controls />
            {activeFile?.info?.images?.screenshots?.length > 0 && (

              <div className="grid grid-cols-4 mt-6 gap-4">
                {activeFile.info.images?.screenshots.map((screenshot) => (
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
              </div>)}
          </div>
          <div>

            <p className="text-sm text-content4">Description</p>
            <p>{activeFile.info.summary}</p>
          </div>
        </div>
        <pre>{JSON.stringify(activeFile, null, 2)}</pre>
      </div>
    </>
  );
};

export default Files;
