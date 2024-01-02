import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { IconReload } from "@tabler/icons-react";
import { useFolders } from "../../hooks/folder-context";
import { Folder } from "../../../types";

export const NoRoms = ({ activeConsole }: { activeConsole: Folder }) => {
  const { scrapeFolder } = useFolders();
  return (
    <div className="container mx-auto flex justify-center">
      <button onClick={() => scrapeFolder(activeConsole, true)}>
        <Card>
          <CardHeader>
            <h2>No ROMs found</h2>
          </CardHeader>

          <CardBody className="text-xs text-center">
            <IconReload className="mx-auto mb-4" />
            Scan again?
          </CardBody>
        </Card>
      </button>
    </div>
  );
};
