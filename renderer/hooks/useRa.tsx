import { useEffect, useState } from "react";
import { useSettings } from "./useSettings";
import {
  UserRecentAchievement,
  UserRecentlyPlayedGames,
  UserSummary
} from "@retroachievements/api";

type APIReturn = {
  summary: UserSummary;
  recentAchievements: UserRecentAchievement[];
  recentGames: UserRecentlyPlayedGames;
};

export const useRa = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<APIReturn | null>(null);
  const { retroAchievementsUsername, isGettingData } = useSettings();

  const getData = async () => {
    const data = (await fetch(
      `/api/ra?username=${retroAchievementsUsername}`
    ).then((rsp) => rsp.json())) as APIReturn;
    setData(data);
    setIsLoading(false);
  };
  useEffect(() => {
    !isGettingData && getData();
  }, [isGettingData]);

  return {
    data,
    isLoading
  };
};
