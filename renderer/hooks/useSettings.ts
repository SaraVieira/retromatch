import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SettingsStore } from "../../types";

export const useSettings = () => {
  const [screenscraperUsername, setScreenscraperUsername] = useState("");
  const [screenscraperPassword, setScreenscraperPassword] = useState("");
  const [retroAchievementsUsername, setRetroAchievementsUsername] =
    useState("");
  const [isGettingData, setIsGettingData] = useState(true);

  const router = useRouter();
  useEffect(() => {
    window.ipc.on("all_settings", (settings: SettingsStore) => {
      setScreenscraperUsername(settings.screenscraper_username);
      setScreenscraperPassword(settings.screenscraper_password);
      setRetroAchievementsUsername(settings.ra_username);
      setIsGettingData(false);
    });
  }, []);

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

  const onChangeUsername = (value) => {
    setScreenscraperUsername(value);
    window.ipc.send("sc-username", value);
  };

  const onChangePassword = (value) => {
    setScreenscraperPassword(value);
    window.ipc.send("sc-password", value);
  };

  const onChangeRAUsername = (value) => {
    setRetroAchievementsUsername(value);
    window.ipc.send("ra-username", value);
  };

  return {
    onClearCache,
    onExportData,
    onImportData,
    onClearInfoCache,
    screenscraperUsername,
    screenscraperPassword,
    onChangeUsername,
    onChangePassword,
    onChangeRAUsername,
    retroAchievementsUsername,
    isGettingData
  };
};
