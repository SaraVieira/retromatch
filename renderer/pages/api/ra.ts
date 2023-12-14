import type { NextApiRequest, NextApiResponse } from "next";

import {
  UserSummary,
  buildAuthorization,
  getUserSummary,
  getAchievementsEarnedBetween,
  DatedUserAchievement,
  getUserAwards,
  UserAwards
} from "@retroachievements/api";
import { subWeeks } from "date-fns";

// docs: https://api-docs.retroachievements.org/

const userName = process.env.RA_USERNAME;
const webApiKey = process.env.RA_API_KEY;

const authorization = buildAuthorization({ userName, webApiKey });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    summary: UserSummary;
    recentAchievements: DatedUserAchievement[];
    awards: UserAwards;
  }>
) {
  const { username } = req.query as { username: string };

  const summary = await getUserSummary(authorization, {
    userName: username
  });
  const recentAchievements = await getAchievementsEarnedBetween(authorization, {
    userName: username,
    fromDate: subWeeks(new Date(), 1),
    toDate: new Date()
  });
  const awards = await getUserAwards(authorization, {
    userName: username
  });
  res.status(200).json({ summary, recentAchievements, awards });
}
