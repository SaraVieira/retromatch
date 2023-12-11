import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  once(channel: string, callback: (...args: unknown[]) => void) {
    ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    );
  },
  subscribe(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);
  },

  addListener(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.addListener(channel, subscription);
  },

  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  }
};

contextBridge.exposeInMainWorld("ipc", handler);
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

export type IpcHandler = typeof handler;
