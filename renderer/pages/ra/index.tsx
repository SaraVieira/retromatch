import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Spinner,
  User
} from "@nextui-org/react";

import { format } from "date-fns";
import { GamePlayed } from "../../components/RetroAchivements/GamePlayed";
import { RecentAchievement } from "../../components/RetroAchivements/RecentAchievement";
import { useRa } from "../../hooks/useRa";
import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";

export const RAMediaUrl = "https://media.retroachievements.org/";

const RA = () => {
  const { data, isLoading, noUserName, getData } = useRa();
  const [userName, setUserName] = useState("");
  const { onChangeRAUsername } = useSettings();

  if (noUserName && !data && !isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-full h-screen flex items-center justify-center">
          <div className="mb-8">
            <h2>You need to set your RetroAchievements account</h2>
            <div className="flex gap-2 items-end mt-8">
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="underlined"
                label="Username"
              />
              <Button
                disabled={!userName}
                onClick={() => {
                  onChangeRAUsername(userName);
                  getData(userName);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
          <AccordionItem
            key="1"
            aria-label="Latest achievements"
            title="Latest achievements"
          >
            <div
              className="pb-8 grid gap-4 items-stretch"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))"
              }}
            >
              {data.recentAchievements.map((game) => (
                <a
                  href={`https://retroachievements.org/achievement/${game.achievementId}`}
                  target="_blank"
                >
                  <RecentAchievement game={game} key={game.achievementId} />
                </a>
              ))}
            </div>
          </AccordionItem>
          <AccordionItem
            key="2"
            aria-label="Latest games played"
            title="Latest games played"
          >
            <div
              className="pb-8 grid gap-4 items-stretch"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
              }}
            >
              {data.recentGames.map((game) => (
                <a
                  href={`https://retroachievements.org/achievement/${game.gameId}`}
                  target="_blank"
                >
                  <GamePlayed game={game} key={game.gameId} />
                </a>
              ))}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default RA;
