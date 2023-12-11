import { useRouter } from "next/router";

import { Input, Select, SelectItem } from "@nextui-org/react";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

import { useFolders } from "../../../hooks/folder-context";
import { useRoms } from "../../../hooks/roms-context";
import { Roms } from "../../../../types";
import { useState } from "react";
import { sortFunc } from "../../../utils/arrays";
import { NoRoms } from "../../../components/Rom/Empty";
import { Rom } from "../../../components/Rom";

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
  const { folders } = useFolders();
  const { roms } = useRoms();
  const { query } = useRouter();
  const activeFolder =
    folders[query.folder as string]?.folders[query.path as string];
  const [search, setSearch] = useState("");
  const [sortByField, setSortByField] = useState("name");
  const [sortType, setSortType] = useState("ascending");

  const romsInConsole = sortFunc(
    Object.values(roms)
      .filter((r: Roms[0]) =>
        Object.values(activeFolder?.files || {}).includes(r.id)
      )
      .filter((rom: Roms[0]) =>
        (rom?.info?.title || rom.name)
          .toLocaleLowerCase()
          .includes(search.toString().toLocaleLowerCase())
      ),
    sortType,
    sortByField
  );

  if (Object.keys(roms).length && !romsInConsole.length) {
    return <NoRoms activeFolder={activeFolder} />;
  }

  const onSelectionChange = (value) => {
    if (!Array.from(value)[0]) return;
    const [sortByField, sortType] = (Array.from(value)[0] as string).split("-");

    setSortByField(sortByField);
    setSortType(sortType);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4 mt-8 w-full bg-background/80 p-3 rounded-lg shadow-sm">
        <Input
          type="search"
          size="sm"
          variant="underlined"
          isClearable
          placeholder="Search for a game"
          value={search}
          onValueChange={setSearch}
          className="max-w-xs"
        />
        <Select
          label="Sort By"
          size="sm"
          variant="underlined"
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
      <ul className="pb-8 flex justify-between flex-wrap gap-8 items-stretch">
        {romsInConsole.map((rom: Roms[0]) => (
          <li key={rom.id}>
            <Rom rom={rom} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
