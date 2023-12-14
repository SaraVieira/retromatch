import { createContext, useContext, useEffect, useState } from "react";
import { Backlog, HLTGame } from "../../types";

const BacklogContext = createContext({
  backlog: [] as Backlog[],
  addToBacklog: (_game: HLTGame) => ({} as any)
});

function BacklogProvider({ children }) {
  const [backlog, setBacklog] = useState([]);

  const getBacklog = () => {
    window.ipc.on("all_backlog", (backlog: Backlog[]) => {
      setBacklog(backlog);
    });
  };

  const addToBacklog = (game: HLTGame) => {
    setBacklog((b: Backlog[]) => [
      {
        game,
        state: "backlog"
      },
      ...b
    ]);
  };

  useEffect(() => {
    getBacklog();
  }, []);

  return (
    <BacklogContext.Provider
      value={{
        backlog,
        addToBacklog
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
