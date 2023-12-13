import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { HLTGame } from "../../../types";

export const AutocompleteGames = () => {
  let list = useAsyncList({
    async load({ signal, filterText }) {
      console.log(filterText);
      let res = await fetch(`/api/hltb?game=${filterText}`, { signal });
      let json = await res.json();
      console.log(json);
      return {
        items: json
      };
    }
  });

  return (
    <Autocomplete
      className="max-w-xs"
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label="Select a game"
      placeholder="Type to search..."
      variant="bordered"
      onInputChange={list.setFilterText}
    >
      {(item: HLTGame) => (
        <AutocompleteItem key={item.game_name} className="capitalize">
          <div className=" flex items-center gap-2">
            <img src={item.image} className="w-5 h-5" />
            <div className="flex items-center justify-between grow w-full">
              {item.game_name}{" "}
              <span className="text-xs text-content4">
                {item.release_world}
              </span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};
