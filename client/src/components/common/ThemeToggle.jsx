import React from "react";
import { changeTheme } from "../../redux/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiSun, BiMoon } from "react-icons/bi";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const handleToggleTheme = () => {
    if (theme === "dark") {
      dispatch(changeTheme("light"));
    } else if (theme === "light") {
      dispatch(changeTheme("dark"));
    }
  };
  return (
    <div onClick={handleToggleTheme} className="cursor-pointer">
      {theme === "dark" ? <BiSun /> : <BiMoon />}
    </div>
  );
};

export default ThemeToggle;
