import React from "react";
import { Button, Listbox, ListboxItem, Tooltip } from "@nextui-org/react";
import {
  IconChevronLeft,
  IconDeviceSdCard,
  IconListCheck,
  IconSettings
} from "@tabler/icons-react";
import { useRouter } from "next/router";

export const ListboxWrapper = ({ children }) => (
  <div className="px-1 py-2  backdrop-saturate-150 bg-background/70 h-full border-r border-divider  sticky min-h-screen z-[99] flex flex-col top-0">
    {children}
  </div>
);

export default function Sidebar() {
  const { pathname, back } = useRouter();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <ListboxWrapper>
      {pathname !== "/" ? (
        <Button
          onClick={() => back()}
          isIconOnly
          variant="ghost"
          className="mx-auto"
        >
          <IconChevronLeft />
        </Button>
      ) : (
        <div className="h-10" />
      )}
      <div className="flex flex-col justify-between h-full grow mt-4">
        <Listbox variant="flat">
          <ListboxItem href="/" key="volumes" textValue="Volumes">
            <Tooltip showArrow content="volumes" placement="bottom">
              <IconDeviceSdCard className={iconClasses} />
            </Tooltip>
          </ListboxItem>

          <ListboxItem href="/backlog" key="backlog" textValue="Backlog">
            <Tooltip showArrow content="Backlog">
              <IconListCheck className={iconClasses} />
            </Tooltip>
          </ListboxItem>
        </Listbox>
        <Listbox variant="flat" aria-label="Listbox menu with icons">
          <ListboxItem href="/settings" key="settings" textValue="Settings">
            <Tooltip showArrow content="Settings">
              <IconSettings className={iconClasses} />
            </Tooltip>
          </ListboxItem>
        </Listbox>
      </div>
    </ListboxWrapper>
  );
}
