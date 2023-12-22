import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Backlog, HLTGame } from "../../types";
import { isEmpty } from "lodash-es";
import { createID } from "../components/AddFolder";

export const statusOptions = [
  { name: "Backlog", id: "backlog" },
  { name: "In Progress", id: "in_progress" },
  { name: "Done", id: "done" }
];
const BacklogContext = createContext({
  backlog: [] as Backlog[],
  addToBacklog: (_game: HLTGame) => ({} as any),
  removeFromBacklog: (_id: string) => {},
  changeItemState: ({
    // eslint-disable-next-line
    id,
    // eslint-disable-next-line
    newState
  }: {
    id: string;
    newState: Backlog["state"];
  }) => {},
  onClear: () => {},
  sortedItems: [] as Backlog[],
  onSearchChange: (_value: string) => {},
  filterValue: "",
  statusFilter: ["backlog", "in_progress"],
  setStatusFilter: (_value: any) => {},
  sortDescriptor: {
    column: "state",
    direction: "descending"
  },
  setSortDescriptor: (_value: any) => {}
});

function BacklogProvider({ children }) {
  const [backlog, setBacklog] = useState([]);

  const getBacklog = () => {
    window.ipc.on("all_backlog", (backlog: Backlog[]) => {
      setBacklog(isEmpty(backlog) ? [] : backlog);
    });
  };

  const addToBacklog = (game: HLTGame) => {
    const newGame = {
      id: createID(),
      game,
      state: "backlog"
    };
    setBacklog((b: Backlog[]) => [newGame, ...b]);
    window.ipc.send("add_to_backlog", newGame);
  };

  const removeFromBacklog = (id: string) => {
    setBacklog((b: Backlog[]) => b.filter((g) => g.id !== id));
    window.ipc.send("remove_from_backlog", id);
  };

  const changeItemState = ({
    id,
    newState
  }: {
    id: string;
    newState: Backlog["state"];
  }) => {
    setBacklog((b: Backlog[]) =>
      b.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            state: newState
          };
        }
        return g;
      })
    );
    window.ipc.send("change_backlog_state", { id, newState });
  };

  useEffect(() => {
    getBacklog();
  }, []);

  const [statusFilter, setStatusFilter] = useState<Backlog["state"][]>([
    "backlog",
    "in_progress"
  ]);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "state",
    direction: "descending"
  });
  const filteredItems = useMemo(() => {
    let filteredBacklog = [...backlog];

    if (hasSearchFilter) {
      filteredBacklog = filteredBacklog.filter((g) =>
        g.game.game_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (Array.from(statusFilter).length !== statusOptions.length) {
      filteredBacklog = filteredBacklog.filter((backlogItem) =>
        Array.from(statusFilter).includes(backlogItem.state)
      );
    }

    return filteredBacklog;
  }, [backlog, statusFilter, filterValue]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first =
        sortDescriptor.column === "state"
          ? a[sortDescriptor.column]
          : a.game[sortDescriptor.column];
      const second =
        sortDescriptor.column === "state"
          ? b[sortDescriptor.column]
          : b.game[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  return (
    <BacklogContext.Provider
      value={{
        backlog,
        addToBacklog,
        removeFromBacklog,
        changeItemState,
        onClear,
        sortedItems,
        onSearchChange,
        filterValue,
        statusFilter,
        setStatusFilter,
        sortDescriptor,
        setSortDescriptor
      }}
    >
      {children}
    </BacklogContext.Provider>
  );
}

function useBacklog() {
  const context = useContext(BacklogContext);
  if (context === undefined) {
    throw new Error("useBacklog must be used within a BacklogProvider");
  }
  return context;
}

export { BacklogProvider, useBacklog };
