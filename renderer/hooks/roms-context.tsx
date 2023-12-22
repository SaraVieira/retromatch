import { createContext, useContext, useEffect, useState } from "react";

import { FileInfo, Roms } from "../../types";

const RomsContext = createContext({
  roms: {},
  keepRom: (_rom: Roms[0], _duplicates: Roms[0][], _folder: any) => ({} as any),
  setRoms: (_a: any) => ({} as any),
  scrapeRom: (_file: Roms[0], _screenscrapper_id: number) => {}
});

function RomProvider({ children }) {
  const [roms, setRomsState] = useState({});

  const getData = () => {
    window.ipc.on("all_roms", (allRoms: Roms) => {
      setRoms(allRoms);
    });
  };

  const setRoms = (romList: Roms) => {
    for (const rom of Object.values(romList)) {
      if (rom?.info?.title && !rom.isDuplicate) {
        const duplicates = Object.values(romList).filter(
          (otherRom: { info?: FileInfo }) =>
            rom !== otherRom && rom.info.title === otherRom?.info?.title
        );
        if (duplicates.length > 0) {
          rom.isDuplicate = true;
        } else {
          rom.isDuplicate = false;
        }
      }
    }
    return setRomsState(romList);
  };

  const keepRom = (rom: Roms[0], duplicates: Roms[0][], folder: any) => {
    window.ipc.send("keep_rom", { rom, duplicates, folder });
    window.ipc.on("rom_kept", ({ romsStore }: { romsStore: Roms }) => {
      setRoms(romsStore);
    });
  };

  const scrapeRom = (file: Roms[0], screenscrapper_id: number) => {
    window.ipc.send("scrape_file", {
      file,
      screenscrapper_id
    });
    window.ipc.on("new_data", (d: Roms[0]) => {
      setRoms({
        ...roms,
        [d.id]: d
      });
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
        setRoms,
        scrapeRom
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
