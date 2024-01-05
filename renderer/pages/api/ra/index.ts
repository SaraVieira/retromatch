import type { NextApiRequest, NextApiResponse } from "next";

import {
  UserSummary,
  buildAuthorization,
  getUserSummary,
  getAchievementsEarnedBetween,
  DatedUserAchievement,
  getUserRecentlyPlayedGames,
  UserRecentlyPlayedGames
} from "@retroachievements/api";
import { subMonths } from "date-fns";

// docs: https://api-docs.retroachievements.org/

const userName = process.env.RA_USERNAME;
const webApiKey = process.env.RA_API_KEY;

const authorization = buildAuthorization({ userName, webApiKey });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    summary: UserSummary;
    recentAchievements: DatedUserAchievement[];
    recentGames: UserRecentlyPlayedGames;
  }>
) {
  const { username } = req.query as { username: string };

  const summary = await getUserSummary(authorization, {
    userName: username
  });
  const recentAchievements = (
    await getAchievementsEarnedBetween(authorization, {
      userName: username,
      fromDate: subMonths(new Date(), 4),
      toDate: new Date()
    })
  ).reverse();
  const recentGames = await getUserRecentlyPlayedGames(authorization, {
    userName: username,
    count: 50
  });
  res.status(200).json({ summary, recentAchievements, recentGames });
}
