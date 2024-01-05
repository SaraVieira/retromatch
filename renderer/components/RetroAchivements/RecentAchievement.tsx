import { Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { UserRecentAchievement } from "@retroachievements/api";
import format from "date-fns/format";
import { RAMediaUrl } from "../../pages/ra";

export const RecentAchievement = ({
  game
}: {
  game: UserRecentAchievement;
}) => {
  return (
    <Card key={game.achievementId} isFooterBlurred className="w-full h-[300px]">
      <CardHeader className="absolute z-10 top-0 flex-col items-start bg-background rounded-t-large ">
        <p className="text-tiny text-white/60 uppercase font-bold">
          {game.consoleName}
        </p>
        <h4 className="text-white/90 font-medium text-xl">{game.title}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src={`${RAMediaUrl}${(game as any).imageBoxArt}`}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center justify-between">
          <p className="text-tiny text-white/60">
            {game.numAchieved} of {(game as any).achievementsTotal} achievements
          </p>
          <p className="text-tiny text-white/60 text-left">
            {format(new Date(game.date), "dd/MM/yyyy")}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
