// Lib 👇🏼
import { NavLink, useLocation } from "react-router-dom";

// Icons 👇🏼
import { FaFingerprint } from "react-icons/fa";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbColorPicker } from "react-icons/tb";

const SettingAside = () => {
  const settings = [
    { title: "profile", icon: <LiaUserEditSolid className="text-xl" /> },
    { title: "theme", icon: <TbColorPicker className="text-xl" /> },
    { title: "privacy-security", icon: <FaFingerprint className="text-xl" /> },
  ];
  const location = useLocation();

  return (
    <aside className="w-full h-full border-r px-1">
      <div className="flex flex-col w-full gap-1">
        {settings.map((itm, idx) => (
          <NavLink
            to={`/setting/${itm.title}`}
            key={idx + itm.title}
            className="text-sm setting-nav-link w-full py-2 px-4 capitalize cursor-pointer hover:bg-muted transition flex gap-2 items-center text-muted-foreground"
          >
            {itm.icon}
            <h3>{itm.title}</h3>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default SettingAside;
