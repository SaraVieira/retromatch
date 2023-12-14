import React from "react";
import { Listbox, ListboxItem, Tooltip } from "@nextui-org/react";
import {
  IconDeviceSdCard,
  IconListCheck,
  IconSettings
} from "@tabler/icons-react";

export const ListboxWrapper = ({ children }) => (
  <div
    className="px-1 py-2  backdrop-saturate-150 bg-background/70 h-full border-r border-divider relative z-50 -mt-[1px] flex flex-col justify-between"
    style={{
      minHeight: "calc(100vh - 66px)"
    }}
  >
    {children}
  </div>
);

export default function Sidebar() {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <ListboxWrapper>
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
    </ListboxWrapper>
  );
}
