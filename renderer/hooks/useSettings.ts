import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const useSettings = () => {
  const router = useRouter();
  const onClearInfoCache = () => {
    window.ipc.send("clear-info-cache", null);

    window.ipc.once("done-cache-clear", () => {
      toast.success("Cache cleared");
      window.ipc.send("load", null);
      router.push("/");
    });
  };

  const onClearCache = () => {
    window.ipc.send("clear-cache", null);

    window.ipc.once("done-cache-clear", () => {
      toast.success("Cache cleared");
      window.ipc.send("load", null);
      router.push("/");
    });
  };

  const onExportData = () => {
    window.ipc.send("export-data", null);
    window.ipc.once("exported", () => {
      toast.success("Data exported");
    });
  };

  const onImportData = () => {
    window.ipc.send("import-data", null);
    window.ipc.once("imported", () => {
      toast.success("Data imported");
      window.ipc.send("load", null);
      router.push("/");
    });
  };

  return {
    onClearCache,
    onExportData,
    onImportData,
    onClearInfoCache
  };
};
