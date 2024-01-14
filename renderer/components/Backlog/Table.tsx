import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { backlogTableColumns } from "./Columns";
import { useCallback } from "react";
import { useBacklog } from "../../hooks/backlog-context";

const columns = [
  { name: "Game", id: "game_name" },
  { name: "Released", id: "release_world" },
  { name: "Status", id: "state" },
  { name: "Main", id: "comp_main" },
  { name: "Main + Sides", id: "comp_plus" },
  { name: "100%", id: "comp_100" },
  { name: "Actions", id: "actions" }
];

export const BacklogTable = () => {
  const renderCell = useCallback(backlogTableColumns, []);
  const { sortedItems, sortDescriptor, setSortDescriptor } = useBacklog();
  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      removeWrapper
      className="mt-4"
      onSortChange={setSortDescriptor}
      // @ts-expect-error
      sortDescriptor={sortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.id}
            align={column.id === "actions" ? "center" : "start"}
            allowsSorting
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={sortedItems}
        emptyContent={"Wow you have no games in your backlog! Impressive"}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
