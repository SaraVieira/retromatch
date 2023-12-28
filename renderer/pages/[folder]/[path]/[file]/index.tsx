import Image from "next/image";
import { useRouter } from "next/router";

import {
  IconCalendarTime,
  IconCategory2,
  IconDeviceGamepad,
  IconDeviceLaptop,
  IconFile
} from "@tabler/icons-react";

import { Rating } from "../../../../components/Rom/Rating";
import Screenshot from "../../../../components/Rom/Screenshot";
import { useFolders } from "../../../../hooks/folder-context";
import { useRoms } from "../../../../hooks/roms-context";

export const Files = () => {
  const { query } = useRouter();
  const { folders } = useFolders();
  const { roms } = useRoms();

  const activeFile = roms[query.file as string];
  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];

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
            <h1 className="text-xl font-bold mb-2">
              {" "}
              {activeFile?.info?.title}
            </h1>
            <Rating rating={activeFile?.info?.rating} />
          </div>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        <div className="flex gap-4">
          <div className="basis-1/3">
            {activeFile?.info?.images?.cover && (
              <Image
                src={activeFile.info.images.cover}
                height={300}
                width={400}
                alt={`${activeFile?.info?.title} cover art`}
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
                className=" max-w-full mx-auto"
              />
            )}
            {activeFile?.info?.images?.screenshots?.length > 0 && (
              <div className="grid grid-cols-4 mt-6 gap-4">
                {activeFile.info.images?.screenshots.map((screenshot) => (
                  <Screenshot
                    img={screenshot}
                    name={activeFile?.info?.name}
                    key={screenshot}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="basis-2/3">
            {activeFile?.info?.summary && (
              <>
                <h2 className="text-sm text-content4 mb-2">Description</h2>
                <p className="text-sm mb-4">{activeFile.info.summary}</p>
                <h2 className="text-sm text-content4 mb-2">Details</h2>
              </>
            )}
            <ul>
              {activeFile?.info?.released && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconCalendarTime size={18} />
                  {activeFile.info.released}
                </li>
              )}
              {activeFile?.info?.genre && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconCategory2 size={18} />
                  {activeFile.info.genre}
                </li>
              )}
              {activeFile?.info?.developer?.name && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconDeviceLaptop size={18} />
                  {activeFile.info.developer?.name}
                </li>
              )}
              {activeFolder?.console?.name && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconDeviceGamepad size={18} />
                  {activeFolder.console.name}
                </li>
              )}
              <li className="flex gap-6 text-sm items-center mb-2">
                <IconFile size={18} />
                {activeFile.fullName}
              </li>
            </ul>
            {activeFile?.info?.videos?.shortplay && (
              <video src={activeFile.info.videos.shortplay} controls />
            )}
            {activeFile?.info?.videos?.youtube && (
              <div
                className="video mt-4 relative h-0"
                style={{
                  paddingBottom: "56.25%" /* 16:9 */,
                  paddingTop: 25
                }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeFile.info.videos.youtube}`}
                  title={`YouTube embed for ${activeFile?.info?.title}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
