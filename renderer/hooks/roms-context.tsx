import { createContext, useContext, useEffect, useState } from "react";

import { FileInfo, Roms } from "../../types";

const RomsContext = createContext({
  roms: {},
  keepRom: (_rom: Roms[0], _duplicates: Roms[0][], _folder: any) => ({} as any),
  setRoms: (_a: any) => ({} as any),
  setRomInfo: (_rom: Roms[0], _info: FileInfo) => {},
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

        rom.isDuplicate = !!duplicates.length;
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

  const setRomInfo = (rom: Roms[0], info: FileInfo) => {
    window.ipc.send("update_rom_info", {
      id: rom.id,
      info
    });
    window.ipc.on("info_updated", (rom: Roms[0]) => {
      setRoms({
        ...roms,
        [rom.id]: rom
      });
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
        setRomInfo,
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
