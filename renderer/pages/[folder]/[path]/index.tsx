import Link from "next/link";
import { useRouter } from "next/router";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Tooltip
} from "@nextui-org/react";
import {
  IconReload,
  IconSortAscending,
  IconSortDescending,
  IconStarFilled,
  IconStarHalfFilled,
  IconStar
} from "@tabler/icons-react";

import { useFolders } from "../../../hooks/folder-context";
import { useRoms } from "../../../hooks/roms-context";
import { humanFileSize } from "../../../utils/size";
import { Roms } from "../../../../types";
import { useState } from "react";
import Image from "next/image";

function sortFunc(results: any[], sortType: string, sortByField: string) {
  const getField = (a: any) =>
    !sortByField.includes(".")
      ? a[sortByField]
      : a.info[sortByField.split(".")[1]];

  if (sortType === "ascending") {
    results.sort((a, b) => (getField(a) < getField(b) ? -1 : 1));
  } else if (sortType === "descending") {
    results.sort((a, b) => (getField(b) > getField(a) ? 1 : -1));
  }
  return results;
}

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
  const { folders, scrapeFolder } = useFolders();
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

  if (romsInConsole.length === 0) {
    return (
      <div className="container mx-auto flex justify-center">
        <button onClick={() => scrapeFolder(activeFolder, true)}>
          <Card>
            <CardHeader>
              <h2>No ROMs found</h2>
            </CardHeader>

            <CardBody className="text-xs text-center">
              <IconReload className="mx-auto mb-4" />
              Scan again?
            </CardBody>
          </Card>
        </button>
      </div>
    );
  }

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
          onSelectionChange={(value) => {
            if (!Array.from(value)[0]) return;
            const [sortByField, sortType] = (
              Array.from(value)[0] as string
            ).split("-");

            setSortByField(sortByField);
            setSortType(sortType);
          }}
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
      <ul className="pb-8 flex justify-between flex-wrap gap-2 items-stretch">
        {romsInConsole.map((rom: Roms[0]) => (
          <li key={rom.id}>
            <Link
              className="text-sm"
              href={`/${query.folder}/${query.path}/${rom.id}`}
            >
              <Card
                isPressable
                isHoverable
                shadow="sm"
                className="h-full flex flex-col justify-between rounded-lg"
              >
                <CardHeader className="flex flex-col items-start gap-1">
                  <Link
                    className="text-sm"
                    href={`/${query.folder}/${query.path}/${rom.id}`}
                  >
                    {rom.info?.title || rom.name}
                  </Link>
                  <div className="flex justify-between items-center w-full">
                    {rom?.info?.rating ? (
                      <Tooltip
                        showArrow={true}
                        content={`${rom?.info.rating / 20} / 5`}
                      >
                        <div className="flex gap-1">
                          {rom?.info?.rating / 20 >= 1 ? (
                            <IconStarFilled className="text-yellow-400 w-3 h-3" />
                          ) : (
                            <IconStar className="text-yellow-400 w-3 h-3" />
                          )}
                          {rom?.info?.rating / 20 >= 2 ? (
                            <IconStarFilled className="text-yellow-400 w-3 h-3" />
                          ) : (
                            <IconStar className="text-yellow-400 w-3 h-3" />
                          )}
                          {rom?.info?.rating / 20 >= 3 ? (
                            <IconStarFilled className="text-yellow-400 w-3 h-3" />
                          ) : (
                            <IconStar className="text-yellow-400 w-3 h-3" />
                          )}
                          {rom?.info?.rating / 20 > 4 ? (
                            rom?.info?.rating / 20 >= 4.5 ? (
                              <IconStarFilled className="text-yellow-400 w-3 h-3" />
                            ) : (
                              <IconStarHalfFilled className="text-yellow-400 w-3 h-3" />
                            )
                          ) : (
                            <IconStar className="text-yellow-400 text-xs h-3 w-3" />
                          )}
                        </div>
                      </Tooltip>
                    ) : null}
                    <span className="text-sm text-content4">
                      {rom?.info?.released}
                    </span>
                  </div>
                </CardHeader>

                <CardBody>
                  {rom.info?.images ? (
                    <Image
                      src={rom.info?.images?.cover || rom.info?.images?.title}
                      alt={rom.name}
                      placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
                      width={250}
                      height={330}
                      className=" max-w-full mx-auto"
                    />
                  ) : null}
                </CardBody>
                <CardFooter className="text-xs text-content4">
                  {humanFileSize(rom.size)}
                </CardFooter>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
