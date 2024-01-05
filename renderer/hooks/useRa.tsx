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

  const getData = async (userName: string) => {
    try {
      setIsLoading(true);
      const data = (await fetch(`/api/ra?username=${userName}`).then((rsp) =>
        rsp.json()
      )) as APIReturn;
      setData(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    !isGettingData && getData(retroAchievementsUsername);
  }, [isGettingData]);

  return {
    data,
    isLoading,
    noUserName: !isGettingData && !retroAchievementsUsername,
    getData
  };
};
