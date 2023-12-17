import SDblue from "../../components/Icons/SDBlue";
import SDBlack from "../../components/Icons/SDBlack";
import SDWhite from "../../components/Icons/SDWhite";
import SDGold from "../../components/Icons/SDGold";
import SDSilver from "../../components/Icons/SDSilver";

export const CardIcon = ({ type }) => {
  if (type === "blue") {
    return <SDblue className="w-6 h-6" />;
  }
  if (type === "black") {
    return <SDBlack className="w-6 h-6" />;
  }
  if (type === "white") {
    return <SDWhite className="w-6 h-6" />;
  }
  if (type === "gold") {
    return <SDGold className="w-6 h-6" />;
  }
  if (type === "silver") {
    return <SDSilver className="w-6 h-6" />;
  }

  return null;
};
