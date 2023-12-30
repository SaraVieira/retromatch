import Image from "next/image";

import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure
} from "@nextui-org/react";

export default function Screenshot({ img, name }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={onOpen}>
        <Image
          key={img}
          src={img}
          height={250}
          width={330}
          alt={`${name} screenshot`}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
          className=" max-w-full mx-auto"
        />
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        classNames={{
          wrapper: "z-[100]",
          body: "p-0"
        }}
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Image
                key={img}
                src={img}
                height={500}
                width={660}
                alt={`${name} screenshot`}
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk4OB6CgABOwEBTU8F5gAAAABJRU5ErkJggg=="
                className=" max-w-full mx-auto"
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
