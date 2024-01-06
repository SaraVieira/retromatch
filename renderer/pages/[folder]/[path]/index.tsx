import { useLayoutEffect, useState } from "react";

import { Input, Select, SelectItem, Slider } from "@nextui-org/react";
import {
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconZoomIn,
  IconZoomOut
} from "@tabler/icons-react";

import { Roms } from "../../../../types";
import RemoveDuplicatesModal from "../../../components/RemoveDuplicatesModal";
import { Rom } from "../../../components/Rom";
import { NoRoms } from "../../../components/Rom/Empty";
import { ScrapeButton } from "../../../components/ScrapeButton";
import { useRoms } from "../../../hooks/roms-context";
import { sortFunc } from "../../../utils/arrays";
import { useActivePath } from "../../../hooks/useActivePath";

const sortOptions = [
  {
    label: "Name",
    key: "name-ascending"
  },
  {
    label: "Name",
    key: "name-descending"
  },
  {
    label: "Size",
    key: "size-ascending"
  },
  {
    label: "Size",
    key: "size-descending"
  },
  {
    label: "Rating",
    key: "info.rating-ascending"
  },
  {
    label: "Rating",
    key: "info.rating-descending"
  }
];

export const Files = () => {
  const { roms } = useRoms();
  const [scrolled, setHasScrolled] = useState(false);
  const { activeFolder, activeConsole } = useActivePath();
  const [search, setSearch] = useState("");
  const [sortByField, setSortByField] = useState("name");
  const [sortType, setSortType] = useState("ascending");
  const [filter, setFilter] = useState("all");
  const [zoom, setZoom] = useState(250);
  const duplicates = Object.values(roms || {})
    .filter((r: Roms[0]) =>
      Object.values(activeConsole?.files || {}).includes(r.id)
    )
    .filter((rom: { isDuplicate }) => rom.isDuplicate);

  const romsInConsole = sortFunc(
    Object.values(roms)
      .filter((r: Roms[0]) =>
        Object.values(activeConsole?.files || {}).includes(r.id)
      )
      .filter((rom: Roms[0]) =>
        (rom?.info?.title || rom.name)
          .toLocaleLowerCase()
          .includes(search.toString().toLocaleLowerCase())
      )
      .filter((rom: Roms[0]) => {
        if (filter === "all") return true;
        if (filter === "with-info") return rom.info?.title;
        if (filter === "no-info") return !rom.info?.title;
        if (filter === "duplicate") return rom.isDuplicate;
      }),
    sortType,
    sortByField
  );

  const onSelectionChange = (value) => {
    if (!Array.from(value)[0]) return;
    const [sortByField, sortType] = (Array.from(value)[0] as string).split("-");

    setSortByField(sortByField);
    setSortType(sortType);
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", function () {
      requestAnimationFrame(() => {
        setHasScrolled(!!Math.round(window.scrollY));
      });
    });
  }, []);

  if (activeConsole && !activeConsole?.files?.length) {
    return <NoRoms activeConsole={activeConsole} />;
  }

  const onZoomChange = (value) => {
    setZoom(value)
  }

  return (
    <>
      <div
        className="backdrop-saturate-150 bg-background/90 backdrop-blur-sm -mt-6 -ml-6 p-6 border-b border-divider w-screen sticky top-0 z-[99] transition-height overflow-hidden !duration-100"
        style={{
          height: !scrolled ? 153 : 90,
          width: "calc(100% + 3rem)"
        }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {activeConsole?.console?.name} ({romsInConsole.length})
          </h1>
          <Slider
            className="max-w-40"
            aria-label="label"
            size="lg"
            startContent={<IconZoomOut />}
            endContent={<IconZoomIn />}
            step={30}
            minValue={100}
            maxValue={250}
            value={zoom}
            onChange={onZoomChange}
          />
          <div className="flex items-center gap-4">
            {duplicates.length > 0 && activeFolder?.connected && (
              <RemoveDuplicatesModal
                folder={activeConsole}
                duplicateRoms={duplicates}
              />
            )}
            <ScrapeButton />
          </div>
        </div>

        <div
          className={`flex justify-between items-center mt-4 w-full ${scrolled && "hidden"
            }`}
        >
          <Input
            type="search"
            size="sm"
            startContent={<IconSearch />}
            isClearable
            placeholder="Search for a game"
            variant="bordered"
            value={search}
            onValueChange={setSearch}
            className="max-w-xs"
          />
          <div className="flex gap-2 grow justify-end">
            <Select
              label="Filter By"
              size="sm"
              variant="bordered"
              placeholder="Filter Games"
              selectedKeys={[filter]}
              onSelectionChange={(value: any) =>
                setFilter(Array.from(value)[0] as string)
              }
              className="max-w-[200px] grow"
            >
              <SelectItem value="all" key="all">
                All
              </SelectItem>
              <SelectItem value="no-info" key="no-info">
                No Info
              </SelectItem>
              <SelectItem value="with-info" key="with-info">
                With Info
              </SelectItem>
              {activeFolder?.connected && (
                <SelectItem value="duplicate" key="duplicate">
                  Duplicates
                </SelectItem>
              )}
            </Select>
            <Select
              label="Sort By"
              size="sm"
              variant="bordered"
              placeholder="Sort Games"
              selectedKeys={[`${sortByField}-${sortType}`]}
              className="max-w-[200px]"
              onSelectionChange={onSelectionChange}
            >
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.key}
                  value={option.key}
                  textValue={option.label}
                >
                  <div className="flex gap-2 items-center justify-between">
                    {option.label}
                    {option.key.includes("ascending") ? (
                      <IconSortAscending />
                    ) : (
                      <IconSortDescending />
                    )}
                  </div>
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-4">
        {romsInConsole.length ? (
          <ul
            className="pb-8 grid gap-4 items-stretch"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${zoom}px, 1fr))`
            }}
          >
            {romsInConsole.map((rom: Roms[0]) => (
              <li key={rom.id} className="w-full">
                <Rom
                  connected={activeFolder.connected}
                  rom={rom}
                  screenscrapperId={activeConsole.console.screenscrapper_id}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-content4 text-xl pt-20 w-full text-center">
            No roms found
          </div>
        )}
      </div>
    </>
  );
};

export default Files;
