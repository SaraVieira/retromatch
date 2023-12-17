import { createContext, useContext, useEffect, useState } from "react";

import { FileInfo, Roms } from "../../types";

const RomsContext = createContext({
  roms: {},
  keepRom: (
    _rom: Roms[0],
    _duplicates: Roms[0][],
    _folder: any,
    _callback: () => void
  ) => ({} as any),
  setRoms: (_a: any) => ({} as any)
});

function RomProvider({ children }) {
  const [roms, setRoms] = useState({});

  const getData = () => {
    window.ipc.on("all_roms", (roms: Roms) => {
      for (const rom of Object.values(roms)) {
        if (rom?.info?.title && !rom.isDuplicate) {
          const duplicates = Object.values(roms).filter(
            (otherRom: { info?: FileInfo }) =>
              rom !== otherRom && rom.info.title === otherRom?.info?.title
          );
          if (duplicates.length > 0) {
            rom.isDuplicate = true;
          }
        }
      }
      setRoms(roms);
    });
  };

  const keepRom = (
    rom: Roms[0],
    duplicates: Roms[0][],
    folder: any,
    callback: () => void
  ) => {
    window.ipc.send("keep_rom", { rom, duplicates, folder });
    window.ipc.on("rom_kept", () => {
      callback();
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <RomsContext.Provider
      value={{
        roms,
        keepRom,
        setRoms
      }}
    >
      {children}
    </RomsContext.Provider>
  );
}

function useRoms() {
  const context = useContext(RomsContext);
  if (context === undefined) {
    throw new Error("useRoms must be used within a RomProvider");
  }
  return context;
}

export { RomProvider, useRoms };
