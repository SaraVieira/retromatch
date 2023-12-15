import { useMemo } from "react";
import { useBacklog } from "../../hooks/backlog-context";
import { IconCheck, IconClock, IconDeviceGamepad } from "@tabler/icons-react";
import { addSeconds, format } from "date-fns";

export const Overview = () => {
  const { backlog } = useBacklog();

  const inBackLog = useMemo(
    () => backlog.filter((s) => s.state === "backlog"),
    [backlog]
  );
  const inProgress = useMemo(
    () => backlog.filter((s) => s.state === "in_progress"),
    [backlog]
  );
  const completed = useMemo(
    () => backlog.filter((s) => s.state === "done"),
    [backlog]
  );
  const sInBacklog = useMemo(
    () =>
      inBackLog.reduce((acc, curr) => {
        acc = curr.game.comp_main + acc;
        return acc;
      }, 0),
    [inBackLog]
  );

  const hoursInBacklog = useMemo(
    () => (sInBacklog / 3600).toFixed(),
    [inBackLog]
  );
  return (
    <div
      className="hidden xl:block fixed right-0  backdrop-saturate-150 bg-background/70 w-[300px] -mt-[26px] z-50 border-l border-divider p-6 h-full"
      style={{ minHeight: "calc(100vh - 66px)" }}
    >
      <h2 className="font-bold text-xl">Overview</h2>
      <div className="flex flex-col gap-1 mt-4">
        <span className="flex gap-2 items-center">
          <IconClock className="w-5 h-5 text-content3-foreground" />
          {inBackLog.length} in the backlog
        </span>
        <span className="flex gap-2 items-center">
          <IconDeviceGamepad className="w-5 h-5 text-content3-foreground" />
          {inProgress.length} in progress
        </span>
        <span className="flex gap-2 items-center">
          <IconCheck className="w-5 h-5 text-content3-foreground" />
          {completed.length} completed
        </span>
        <h2 className="font-bold text-xl my-4">Some math</h2>
        <span>
          It would take you{" "}
          <span className="font-bold">{hoursInBacklog} hours</span> to finish
          the backlog.
        </span>
        <span>
          That{"'"}s{" "}
          <span className="font-bold">
            {(parseInt(hoursInBacklog) / 24).toFixed()} days
          </span>{" "}
          of just playing video games.
        </span>
        <span>
          If you started right now you would end your backlog on the{" "}
          <span className="font-bold">
            {format(
              addSeconds(new Date(), sInBacklog),
              "dd 'of' MMMM yyyy 'at' hh:mm"
            )}
          </span>
        </span>
      </div>
    </div>
  );
};
