import { Tooltip } from "@nextui-org/react";
import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled
} from "@tabler/icons-react";
const iconClasses = { className: "text-yellow-400 w-3 h-3" };

export const Rating = ({ rating }) => {
  const usableRating = rating / 20;
  return rating ? (
    <Tooltip showArrow={true} content={`${usableRating.toFixed(1)} / 5`}>
      <div className="flex gap-1">
        {usableRating >= 1 ? (
          <IconStarFilled {...iconClasses} />
        ) : (
          <IconStar {...iconClasses} />
        )}
        {usableRating >= 2 ? (
          <IconStarFilled {...iconClasses} />
        ) : (
          <IconStar {...iconClasses} />
        )}
        {usableRating >= 3 ? (
          <IconStarFilled {...iconClasses} />
        ) : (
          <IconStar {...iconClasses} />
        )}
        {usableRating > 4 ? (
          usableRating >= 4.5 ? (
            <IconStarFilled {...iconClasses} />
          ) : (
            <IconStarHalfFilled {...iconClasses} />
          )
        ) : (
          <IconStar {...iconClasses} />
        )}
      </div>
    </Tooltip>
  ) : null;
};
