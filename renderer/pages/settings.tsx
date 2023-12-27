import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  cn,
  useDisclosure
} from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useSettings } from "../hooks/useSettings";

const listItemStyles =
  "w-full bg-content1 hover:bg-content2 items-center max-w-lg flex justify-between p-4 rounded-lg  border-2 border-transparent";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    onClearCache,
    onImportData,
    onExportData,
    onClearInfoCache,
    screenscraperUsername,
    screenscraperPassword,
    retroAchievementsUsername,
    onChangeUsername,
    onChangePassword,
    onChangeRAUsername
  } = useSettings();

  return (
    <div className="py-12 flex flex-col items-center gap-4">
      <Tabs
        selectedKey="accounts"
        aria-label="Options"
        className="w-full max-w-lg m-auto"
        variant="underlined"
      >
        <Tab key="app" title="Application" className="w-full max-w-lg m-auto">
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
          {process.env.NODE_ENV === "development" && (
            <div className={listItemStyles}>
              Clear game info cache
              <Button onPress={onClearInfoCache}>Clear</Button>
            </div>
          )}
        </Tab>
        <Tab key="accounts" title="Accounts" className="w-full max-w-lg m-auto">
          <div className="mb-8">
            <h2>Screenscraper account</h2>
            <Input
              value={screenscraperUsername}
              onChange={(e) => onChangeUsername(e.target.value)}
              type="text"
              variant="underlined"
              label="Username"
            />
            <Input
              type="password"
              variant="underlined"
              label="Password"
              value={screenscraperPassword}
              onChange={(e) => onChangePassword(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <h2>RetroAchievements account</h2>
            <Input
              type="text"
              value={retroAchievementsUsername}
              onChange={(e) => onChangeRAUsername(e.target.value)}
              variant="underlined"
              label="Username"
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Settings;
