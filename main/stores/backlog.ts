import Store from "electron-store";
import { Backlog } from "../../types";
import { ipcMain } from "electron";

export const backlogStore = new Store<{
  [id: string]: Backlog;
}>({
  name: "backlog"
});

export const initBacklogState = () => {
  ipcMain.on("add_to_backlog", async (_, game: Backlog) => {
    backlogStore.set(game.id, game);
  });

  ipcMain.on("remove_from_backlog", async (_, id: string) => {
    backlogStore.delete(id);
  });

  ipcMain.on(
    "change_backlog_state",
    async (_, { id, newState }: { id: string; newState: Backlog["state"] }) => {
      backlogStore.set(id, {
        ...backlogStore.get(id),
        state: newState
      });
    }
  );
};
