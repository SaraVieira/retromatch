import { Switch, cn } from "@nextui-org/react";
import { useTheme } from "next-themes";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="py-12 flex flex-col items-center gap-4">
      <Switch
        isSelected={theme === "dark"}
        onValueChange={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse w-full max-w-lg bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
          )
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-medium">Dark Mode</p>
        </div>
      </Switch>
    </div>
  );
};

export default Settings;
