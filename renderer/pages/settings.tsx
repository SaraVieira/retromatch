import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  cn,
  useDisclosure
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useSettings } from "../hooks/useSettings";
import toast from "react-hot-toast";

const listItemStyles =
  "w-full bg-content1 hover:bg-content2 items-center max-w-lg flex justify-between p-4 rounded-lg  border-2 border-transparent";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { onClearCache, onImportData, onExportData } = useSettings();

  toast.success("sup", { duration: Infinity });

  return (
    <div className="py-12 flex flex-col items-center gap-4">
      <Switch
        isSelected={theme === "dark" || !theme}
        onValueChange={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse cursor-pointer",
            listItemStyles
          )
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-medium">Dark Mode</p>
        </div>
      </Switch>
      <div className={listItemStyles}>
        Clear local cache
        <Button onPress={onOpen}>Clear</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Clear local cache
                </ModalHeader>
                <ModalBody>
                  <p>
                    This will delete all the local info for your roms and
                    folder, are you sure you want to do this?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="danger" onPress={onClearCache}>
                    Clear
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className={listItemStyles}>
        Export local data
        <Button onPress={onExportData}>Export</Button>
      </div>
      <div className={listItemStyles}>
        Import data from json
        <Button onPress={onImportData}>Import</Button>
      </div>
    </div>
  );
};

export default Settings;
