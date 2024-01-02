import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { IconCheck, IconFolder } from "@tabler/icons-react";
import { useRouter } from "next/router";

import { humanFileSize } from "../../utils/size";
import { CardIcon } from "./CardIcon";

import { Menu, Item, useContextMenu } from "react-contexify";
import { useFolders } from "../../hooks/folder-context";

export const Folder = ({ folder }) => {
  const router = useRouter();
  const { deleteFolder } = useFolders();
  const MENU_ID = `folder_context_menu_${folder.id}`;
  const { show, hideAll } = useContextMenu({
    id: MENU_ID
  });

  const handleContextMenu = (event) =>
    show({
      event
    });

  const onClick = (file: { path: string; id: string }) =>
    router.push(`/${file.id}`);

  return (
    <li className="w-[200px] h-full">
      <Menu id={MENU_ID}>
        <Item
          id="copy"
          onClick={() => {
            deleteFolder(folder.id);
            hideAll();
          }}
        >
          Delete
        </Item>
      </Menu>
      <button
        onContextMenu={handleContextMenu}
        className="w-full"
        onClick={() => onClick(folder)}
      >
        <Card>
          <CardHeader className="gap-2">
            {folder.sdCard ? (
              <CardIcon type={folder.sdCardStyle} />
            ) : (
              <IconFolder />
            )}
            <div className="flex grow justify-between">
              {folder.name}
              {folder.connected ? (
                <Tooltip content="Connected">
                  <IconCheck className="text-green-500 w-5 h-5" />
                </Tooltip>
              ) : null}
            </div>
          </CardHeader>
          <CardBody className="text-xs text-content4 flex items-center justify-between flex-row">
            <Tooltip content={folder.path}>
              <span className="max-w-[50%] truncate">{folder.path}</span>
            </Tooltip>

            {humanFileSize(folder.space)}
          </CardBody>
        </Card>
      </button>
    </li>
  );
};
