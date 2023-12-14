import React from "react";
import { AutocompleteGames } from "../components/Backlog/AutocompleteGames";
import { BacklogTable } from "../components/Backlog/Table";
import { BacklogToolbar } from "../components/Backlog/Toolbar";

const BacklogPage = () => {
  return (
    <div className="w-full">
      <AutocompleteGames />
      <div className="mt-8">
        <BacklogToolbar />
        <BacklogTable />
      </div>
    </div>
  );
};

export default BacklogPage;
