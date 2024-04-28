import { useEffect, useState } from "react";

import Header from "./common/header";
// Utils 👇🏼
import themeList from "@/utils/themeList.json";
// Hooks 👇🏼
import { useTheme } from "@/context/theme-provider";

const ThemeView = () => {
  const { setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState("");
  const currentTheme = localStorage.getItem("vite-ui-theme");

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const handleChangeTheme = (theme) => {
    setTheme(theme);
  };

  return (
    <div className="w-full px-2">
      <div className="flex flex-col  gap-8 w-full ">
        {/* Header 👇🏼*/}
        <Header />

        {/* Main bosy 👇🏼 */}
        <main className="w-full md:w-[60%]">
          <div className=" w-full grid gap-4 max-sm:grid-cols-2 grid-cols-3">
            {themeList.map((t, idx) => (
              <div
                className={`flex flex-col items-center gap-1`}
                key={idx + t.name}
                onClick={() => handleChangeTheme(t.name)}
              >
                <img
                  src={t.cover}
                  className={`transition w-full h-full object-contain cursor-pointer  ${
                    selectedTheme === t.name && "scale-110"
                  }`}
                />
                <h3 className="text-sm capitalize">{t.name}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ThemeView;
