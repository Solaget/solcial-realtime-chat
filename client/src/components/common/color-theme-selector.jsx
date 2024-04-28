import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";

const ColorThemeSelector = ({ colorCircleSize }) => {
  const themeColors = [
    { primary: "rgb(36, 138, 163)", "primary-foreground": "" },
    { primary: "#1a73e8", "primary-foreground": "" },
    { primary: "#954fff", "primary-foreground": "" },
    { primary: "rgb(231, 7, 141)", "primary-foreground": "" },
    { primary: "#ff8200", "primary-foreground": "" },
    { primary: "rgb(251, 46, 46)", "primary-foreground": "" },
  ];

  const handleChangeThemeColor = (theme) => {
    document.documentElement.style.setProperty("--primary", theme.primary);
  };
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={twMerge(
            `bg-primary size-[30px] rounded-full ${colorCircleSize}`
          )}
        ></div>
      </PopoverTrigger>
      <PopoverContent side="right" className="w-fit p-1">
        <div className="w-fit grid grid-cols-3 gap-2">
          {themeColors.map((t) => (
            <Button
              className={twMerge(`rounded-full size-[30px] ${colorCircleSize}`)}
              onClick={() => handleChangeThemeColor(t)}
              style={{ background: t.primary }}
              size="icon"
              variant="ghost"
              key={t.primary}
            ></Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorThemeSelector;
