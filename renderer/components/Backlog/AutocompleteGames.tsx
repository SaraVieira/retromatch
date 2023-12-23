import React from "react";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import { HLTGame } from "../../../types";
import { useBacklog } from "../../hooks/backlog-context";

export const AutocompleteGames = () => {
  const { addToBacklog, backlog } = useBacklog();

  const list = useAsyncList({
    //@ts-ignore
    async load({ signal, filterText }) {
      const res = await fetch(`/api/hltb?game=${filterText}`, { signal });
      const items = await res.json();

      return {
        items
      };
    }
  });

  return (
    <Autocomplete
      className="max-w-full"
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label="Add a new game"
      variant="flat"
      disabledKeys={backlog.map((a) => a.game.game_id.toString())}
      onInputChange={list.setFilterText}
    >
      {(item: HLTGame) => (
        <AutocompleteItem
          textValue={item.game_name}
          key={item.game_id.toString()}
          className="capitalize"
          onClick={() => {
            addToBacklog(item);
          }}
        >
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
