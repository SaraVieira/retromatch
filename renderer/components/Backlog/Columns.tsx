import { Chip, Tooltip } from "@nextui-org/react";
import { Backlog } from "../../../types";
import { useBacklog } from "../../hooks/backlog-context";
import { IconCheck, IconDeviceGamepad, IconTrash } from "@tabler/icons-react";
import { Key } from "react";

const statusColorMap = {
  done: "success",
  backlog: "danger",
  in_progress: "warning"
};

export const backlogTableColumns = (backlogItem: Backlog, columnKey: Key) => {
  const { changeItemState, removeFromBacklog } = useBacklog();
  const cellValue = backlogItem[columnKey as string];

  switch (columnKey) {
    case "game_name":
      return (
        <div className=" flex items-center gap-2">
          <img src={backlogItem.game.image} className="w-6 h-6 rounded-sm" />
          <div className="flex items-center justify-between grow w-full">
            {backlogItem.game.game_name}
          </div>
        </div>
      );

    case "released":
      return <div> {backlogItem.game.release_world}</div>;
    case "comp_main":
      return <div> {(backlogItem.game.comp_main / 3600).toFixed()} hours</div>;
    case "comp_plus":
      return <div> {(backlogItem.game.comp_plus / 3600).toFixed()} hours</div>;
    case "comp_100":
      return <div> {(backlogItem.game.comp_100 / 3600).toFixed()} hours</div>;
    case "state":
      return (
        <Chip
          className="capitalize"
          color={statusColorMap[cellValue]}
          size="sm"
          variant="flat"
        >
          {cellValue.split("_").join(" ")}
        </Chip>
      );
    case "actions":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip color="primary" content="Mark as playing">
            <button
              className="text-lg text-primary cursor-pointer active:opacity-50"
              onClick={() =>
                changeItemState({
                  id: backlogItem.id,
                  newState: "in_progress"
                })
              }
            >
              <IconDeviceGamepad />
            </button>
          </Tooltip>
          <Tooltip color="success" content="Mark as done">
            <button
              className="text-lg text-success cursor-pointer active:opacity-50"
              onClick={() =>
                changeItemState({
                  id: backlogItem.id,
                  newState: "done"
                })
              }
            >
              <IconCheck />
            </button>
          </Tooltip>
          <Tooltip color="danger" content="Delete">
            <button
              onClick={() => removeFromBacklog(backlogItem.id)}
              className="text-lg text-danger cursor-pointer active:opacity-50"
            >
              <IconTrash />
            </button>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
};
