import { useState } from "react";

import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react";

import { Roms } from "../../types";
import { RomDuplicate } from "./RomDuplicate";

export default function RemoveDuplicatesModal({ duplicateRoms }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rom, setRom] = useState(duplicateRoms[0]);

  const otherDuplicates = duplicateRoms.filter(
    (otherRom) => otherRom !== rom && rom.info.title === otherRom.info.title
  );
  return (
    <>
      <Button onClick={onOpen}>Remove {duplicateRoms.length} Duplicates</Button>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <h2 className="text-center">
                Keep which <b>{rom?.info?.title}</b>?
              </h2>
              <ul className="pb-8 flex justify-between flex-wrap gap-8 items-stretch">
                {[rom, ...otherDuplicates].map((rom: Roms[0]) => (
                  <li key={rom.id}>
                    <RomDuplicate rom={rom} onClick={() => null} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
