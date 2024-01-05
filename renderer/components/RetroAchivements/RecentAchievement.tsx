import { Card, CardFooter, Image } from "@nextui-org/react";
import { UserRecentAchievement } from "@retroachievements/api";
import format from "date-fns/format";
import { RAMediaUrl } from "../../pages/ra";

export const RecentAchievement = ({
  game
}: {
  game: UserRecentAchievement;
}) => {
  return (
    <Card key={game.achievementId} isFooterBlurred className="w-full h-[150px]">
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src={`${RAMediaUrl}${(game as any).badgeUrl}`}
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100 flex-col">
        <div className="flex flex-col">
          <p className="text-[9px] text-white/60 uppercase font-bold">
            {game.consoleName} / {game.gameTitle}
          </p>
          <h4 className="text-white/90 font-medium text-[12px]">
            {game.description}
          </h4>
        </div>
        <div className="flex flex-grow gap-2 items-center justify-between w-full">
          <p className="text-[9px] text-white/60">{game.points} points</p>
          <p className="text-[9px] text-white/60 text-left">
            {format(new Date(game.date), "dd/MM/yyyy")}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
