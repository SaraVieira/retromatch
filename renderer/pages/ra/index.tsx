import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { Spinner, User } from "@nextui-org/react";

import { format } from "date-fns";
import { GamePlayed } from "../../components/RetroAchivements/GamePlayed";
import { RecentAchievement } from "../../components/RetroAchivements/RecentAchievement";
import { useRa } from "../../hooks/useRa";

export const RAMediaUrl = "https://media.retroachievements.org/";

const RA = () => {
  const { data, isLoading } = useRa();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-6 flex items-center justify-between">
        <User
          name={(data.summary as any).user}
          description={
            <div>
              {data.summary.totalPoints || data.summary.totalSoftcorePoints}{" "}
              points <br />
              Member since{" "}
              {format(new Date(data.summary.memberSince), "dd/MM/yyyy")}
            </div>
          }
          avatarProps={{
            src: `${RAMediaUrl}${data.summary.userPic}`,
            className: "w-20 h-20"
          }}
        />
      </div>
      <div className="container mx-auto mt-12">
        <h2 className="text-xl font-bold mb-6">Last achievements</h2>
        <div
          className="pb-8 grid gap-4 items-stretch"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
          }}
        >
          {data.recentAchievements.map((game) => (
            <RecentAchievement game={game} key={game.achievementId} />
          ))}
        </div>
      </div>
      <div className="container mx-auto mt-12">
        <h2 className="text-xl font-bold mb-6">Last games played</h2>
        <div
          className="pb-8 grid gap-4 items-stretch"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
          }}
        >
          {data.recentGames.map((game) => (
            <GamePlayed game={game} key={game.gameId} />
          ))}
        </div>
      </div>
    </>
  );
};

export default RA;
