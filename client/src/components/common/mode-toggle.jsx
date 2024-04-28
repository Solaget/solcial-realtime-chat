import { Sun, MoonStar } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/theme-provider";
import { twMerge } from "tailwind-merge";

export function ModeToggle({ className }) {
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState("");
  const currentTheme = localStorage.getItem("vite-ui-theme");
  React.useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);
  const themes = ["dark", "light", "system"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme, idx) => (
          <DropdownMenuItem
            key={idx * Math.random() * 19}
            onClick={() => setTheme(theme)}
            className={`capitalize ${
              theme === selectedTheme &&
              "bg-accent/90 text-accent-foreground/90 transition"
            }`}
          >
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
