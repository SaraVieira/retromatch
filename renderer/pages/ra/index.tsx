import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
  User
} from "@nextui-org/react";
import {
  DatedUserAchievement,
  UserRecentlyPlayedGames,
  UserSummary
} from "@retroachievements/api";
import { format } from "date-fns";

const mediaUrl = "https://media.retroachievements.org/";

type APIReturn = {
  summary: UserSummary;
  recentAchievements: DatedUserAchievement[];
  recentGames: UserRecentlyPlayedGames;
};

const RA = () => {
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
            src: `${mediaUrl}${data.summary.userPic}`,
            className: "w-20 h-20"
          }}
        />
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
            <Card
              key={game.gameId}
              isFooterBlurred
              className="w-full h-[300px]"
            >
              <CardHeader className="absolute z-10 top-0 flex-col items-start bg-background rounded-t-large ">
                <p className="text-tiny text-white/60 uppercase font-bold">
                  {game.consoleName}
                </p>
                <h4 className="text-white/90 font-medium text-xl">
                  {game.title}
                </h4>
              </CardHeader>
              <Image
                removeWrapper
                alt="Relaxing app background"
                className="z-0 w-full h-full object-cover"
                src={`${mediaUrl}${(game as any).imageBoxArt}`}
              />
              <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                <div className="flex flex-grow gap-2 items-center justify-between">
                  <p className="text-tiny text-white/60">
                    {game.numAchieved} of {(game as any).achievementsTotal}{" "}
                    achievements
                  </p>
                  <p className="text-tiny text-white/60 text-left">
                    {format(new Date(game.lastPlayed), "dd/MM/yyyy")}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <pre>{JSON.stringify(data.recentGames, null, 2)}</pre>
    </>
  );
};

export default RA;
