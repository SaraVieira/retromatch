import { useState } from "react";

import {
  Button,
  Modal,
  ModalContent,
  Spinner,
  useDisclosure
} from "@nextui-org/react";

import { Roms } from "../../types";
import { useFolders } from "../hooks/folder-context";
import { useRoms } from "../hooks/roms-context";
import { RomDuplicate } from "./RomDuplicate";

export default function RemoveDuplicatesModal({ duplicateRoms, folder }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { syncFolder, isSyncing } = useFolders();
  const { keepRom } = useRoms();
  const [rom, setRom] = useState(duplicateRoms[0]);

  const otherDuplicates = duplicateRoms.filter(
    (otherRom) => otherRom !== rom && rom.info.title === otherRom.info.title
  );

  const filterRom = (rom) => {
    keepRom(rom, duplicateRoms, folder, () => {
      syncFolder(folder);
      setRom(duplicateRoms[0]);
    });
  };
  return (
    <>
      <Button onClick={onOpen}>Remove {duplicateRoms.length} Duplicates</Button>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => {
            if (isSyncing) {
              return (
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <h1>Syncing info</h1>
                  <Spinner />
                </div>
              );
            }

            return (
              <>
                <h2 className="text-center">
                  Keep which <b>{rom?.info?.title}</b>?
                </h2>
                <ul className="pb-8 flex justify-between flex-wrap gap-8 items-stretch">
                  {[rom, ...otherDuplicates].map((rom: Roms[0]) => (
                    <li key={rom.id}>
                      <RomDuplicate rom={rom} onClick={() => filterRom(rom)} />
                    </li>
                  ))}
                </ul>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}
