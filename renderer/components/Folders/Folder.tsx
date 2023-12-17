import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import { IconFolder } from "@tabler/icons-react";
import { useRouter } from "next/router";

import { humanFileSize } from "../../utils/size";
import { CardIcon } from "./CardIcon";

export const Folder = ({ folder }) => {
  const router = useRouter();
  const onClick = (file: { path: string; id: string }) =>
    router.push(`/${file.id}`);

  return (
    <li className="w-[200px] h-full">
      <button className="w-full" onClick={() => onClick(folder)}>
        <Card>
          <CardHeader className="gap-2">
            {folder.sdCard ? (
              <CardIcon type={folder.sdCardStyle} />
            ) : (
              <IconFolder />
            )}
            {folder.name}
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
