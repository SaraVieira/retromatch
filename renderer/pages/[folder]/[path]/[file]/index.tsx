import { useState } from "react";

import { Button, Image, Input, Textarea } from "@nextui-org/react";
import {
  IconCalendarTime,
  IconCategory2,
  IconDeviceGamepad,
  IconDeviceLaptop,
  IconEdit,
  IconFile
} from "@tabler/icons-react";

import { Rating } from "../../../../components/Rom/Rating";
import Screenshot from "../../../../components/Rom/Screenshot";
import { useActivePath } from "../../../../hooks/useActivePath";

export const Files = () => {
  const { activeRom, activeConsole } = useActivePath();
  const [editing, setEditing] = useState(false);

  const editInfo = () => {
    setEditing(true);
  };

  const saveInfo = () => {
    setEditing(false);
  };

  const Title = () =>
    editing ? (
      <Input
        aria-label="title"
        placeholder="Title"
        value={activeRom?.info?.title}
      />
    ) : (
      <h1 className="text-xl font-bold mb-2">{activeRom?.info?.title}</h1>
    );

  const Description = () =>
    editing ? (
      <Textarea
        aria-label="description"
        placeholder="Description"
        value={activeRom?.info?.summary}
      />
    ) : (
      <p className="text-sm mb-4">{activeRom.info.summary}</p>
    );

  return (
    <form>
      <div
        className="backdrop-saturate-150 bg-background/90 backdrop-blur-sm -mt-6 -ml-6 p-6 border-b border-divider w-screen sticky top-0 z-[99] overflow-hidden"
        style={{
          height: 90,
          width: "calc(100% + 3rem)"
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <Title />
            <Rating rating={activeRom?.info?.rating} />
          </div >
          <div className="flex items-center gap-4">
            <Button
              onClick={editing ? saveInfo : editInfo}
              startContent={<IconEdit />}
            >
              Edit
            </Button>
          </div>
        </div >
      </div >
      <div className="container mx-auto mt-4">
        <div className="flex gap-4">
          <div className="basis-1/3">
            {activeRom?.info?.images?.cover && (
              <Image
                src={activeRom.info.images.cover}
                height={300}
                width={400}
                alt={`${activeRom?.info?.title} cover art`}
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
                className=" max-w-full mx-auto"
              />
            )}
            {activeRom?.info?.images?.screenshots?.length > 0 && (
              <div className="grid grid-cols-4 mt-6 gap-4">
                {activeRom.info.images?.screenshots.map((screenshot) => (
                  <Screenshot
                    img={screenshot}
                    name={activeRom?.info?.name}
                    key={screenshot}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="basis-2/3">
            {activeRom?.info?.summary && (
              <>
                <h2 className="text-sm text-content4 mb-2">Description</h2>
                <Description />
                <h2 className="text-sm text-content4 mb-2">Details</h2>
              </>
            )}
            <ul>
              {activeRom?.info?.released && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconCalendarTime size={18} />
                  {activeRom.info.released}
                </li>
              )}
              {activeRom?.info?.genre && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconCategory2 size={18} />
                  {activeRom.info.genre}
                </li>
              )}
              {activeRom?.info?.developer?.name && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconDeviceLaptop size={18} />
                  {activeRom.info.developer?.name}
                </li>
              )}
              {activeConsole?.console?.name && (
                <li className="flex gap-6 text-sm items-center mb-2">
                  <IconDeviceGamepad size={18} />
                  {activeConsole.console.name}
                </li>
              )}
              <li className="flex gap-6 text-sm items-center mb-2">
                <IconFile size={18} />
                {activeRom?.fullName}
              </li>
            </ul>
            {
              activeRom?.info?.videos?.shortplay && (
                <video src={activeRom.info.videos.shortplay} controls />
              )
            }
            {
              activeRom?.info?.videos?.youtube && (
                <div
                  className="video mt-4 relative h-0"
                  style={{
                    paddingBottom: "56.25%" /* 16:9 */,
                    paddingTop: 25
                  }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${activeRom.info.videos.youtube}`}
                    title={`YouTube embed for ${activeRom?.info?.title}`}
                  />
                </div>
              )
            }
          </div >
        </div >
      </div >
    </form >
  );
};

export default Files;
