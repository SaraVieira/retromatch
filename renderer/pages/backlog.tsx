import React from "react";
import { AutocompleteGames } from "../components/Backlog/AutocompleteGames";
import { BacklogTable } from "../components/Backlog/Table";
import { BacklogToolbar } from "../components/Backlog/Toolbar";
import { Overview } from "../components/Backlog/Overview";

const BacklogPage = () => {
  return (
    <div className="flex gap-4">
      <div className="w-full xl:w-[calc(100%-300px)]">
        <AutocompleteGames />
        <div className="mt-8">
          <BacklogToolbar />
          <BacklogTable />
        </div>
      </div>
      <Overview />
    </div>
  );
};

export default BacklogPage;
