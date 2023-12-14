import { AutocompleteGames } from "../components/Backlog/AutocompleteGames";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input
} from "@nextui-org/react";
import React from "react";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useBacklog, statusOptions } from "../hooks/backlog-context";
import { capitalize } from "lodash-es";
import { BacklogTable } from "../components/Backlog/Table";

const BacklogPage = () => {
  const {
    onClear,
    onSearchChange,
    filterValue,
    statusFilter,
    setStatusFilter
  } = useBacklog();

  return (
    <div className="w-full">
      <AutocompleteGames />

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <Input
            size="sm"
            aria-label="backlog search"
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<IconSearch />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<IconChevronDown className="text-small" />}
                variant="flat"
              >
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={statusFilter}
              selectionMode="multiple"
              onSelectionChange={setStatusFilter}
            >
              {statusOptions.map((status) => (
                <DropdownItem key={status.id} className="capitalize">
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <BacklogTable />
      </div>
    </div>
  );
};

export default BacklogPage;
