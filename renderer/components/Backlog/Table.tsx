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
  { name: "Released", id: "released" },
  { name: "Status", id: "state" },
  { name: "Complete Main", id: "comp_main" },
  { name: "Complete Main + Sides", id: "comp_plus" },
  { name: "Complete Everything", id: "comp_100" },
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
