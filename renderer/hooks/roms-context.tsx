import * as React from "react";

import { useRouter } from "next/router";

import { Roms } from "../../types";

const RomsContext = React.createContext({
  roms: {},
  setRoms: (a: any) => ({} as any),
});

function RomProvider({ children }) {
  const [roms, setRoms] = React.useState({});

  const getData = () => {
    window.ipc.on("all_roms", (roms: Roms) => {
      setRoms(roms);
    });
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <RomsContext.Provider
      value={{
        roms,
        // @ts-ignore
        setRoms,
      }}
    >
      {children}
    </RomsContext.Provider>
  );
}

function useRoms() {
  const context = React.useContext(RomsContext);
  if (context === undefined) {
    throw new Error("useRoms must be used within a RomProvider");
  }
  return context;
}

export { RomProvider, useRoms };
