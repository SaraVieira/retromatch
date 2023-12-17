import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";

import { Roms } from "../../types";
import { useRoms } from "../hooks/roms-context";
import { RomDuplicate } from "./RomDuplicate";

export default function RemoveDuplicatesModal({ duplicateRoms, folder }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { keepRom } = useRoms();
  const rom = duplicateRoms[0];

  const otherDuplicates = duplicateRoms.filter(
    (otherRom) => otherRom !== rom && rom.info.title === otherRom.info.title
  );

  const filterRom = (rom) => {
    keepRom(rom, duplicateRoms, folder);
  };

  const size = otherDuplicates.length > 1 ? "5xl" : "3xl";
  return (
    <>
      <Button onClick={onOpen}>Remove {duplicateRoms.length} Duplicates</Button>
      <Modal size={size} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h2>
                  Keep which <b>{rom?.info?.title}</b>?
                </h2>
              </ModalHeader>
              <ModalBody>
                <ul className="pb-8 flex justify-between flex-wrap gap-8 items-stretch">
                  {[rom, ...otherDuplicates].map((rom: Roms[0]) => (
                    <li key={rom.id}>
                      <RomDuplicate rom={rom} onClick={() => filterRom(rom)} />
                    </li>
                  ))}
                </ul>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
