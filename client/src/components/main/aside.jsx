// Icons 👇🏼
import { AiOutlineLogout, AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiOutlineChat } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import { RiContactsLine } from "react-icons/ri";

// Lib 👇🏼
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// Components 👇🏼
import { ModeToggle } from "@/components/common/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateGroup from "../miscellaneous/group/create-group";
import ColorThemeSelector from "../common/color-theme-selector";
// Utils👇🏼
import LogoutHandler from "@/handler/logout";
import Contacts from "../miscellaneous/contacts";
const Aside = () => {
  const authInfo = useSelector((state) => state.auth.authInfo);
  
  return (
    <div className="h-screen z-50 max-md:hidden w-[70px] bg-secondary py-5">
      <div className="h-full flex flex-col items-center justify-between ">
        {/* Top */}
        <div className="flex flex-col items-center gap-16 w-full ">
          {/* Profile Container */}
          <div>
            <Avatar className="border-2 border-primary size-[55px]">
              <AvatarImage
                src={import.meta.env.VITE_PROFILE_URL + authInfo?.avatar?.url}
              />
              <AvatarFallback className="capitalize text-xl">
                {authInfo?.fullName?.trim().at(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Navigator Taabs */}
          <ul className="w-full flex flex-col items-center">
            <NavLink
              to="/chat"
              className="page-navigator cursor-pointer w-full py-3 flex justify-center"
            >
              <HiOutlineChat className="text-[28px]" />
            </NavLink>

            <CreateGroup>
              <span className="cursor-pointer w-full py-3 bg-dark-secondary/0 flex justify-center">
                <AiOutlineUsergroupAdd className="text-[28px] max-sm:text-[24px]" />
              </span>
            </CreateGroup>

            <NavLink
              to="/setting/profile"
              className="page-navigator cursor-pointer w-full py-3 flex justify-center"
            >
              <CiSettings className="text-[28px]" />
            </NavLink>

            <Contacts>
              <span className="cursor-pointer w-full py-3 bg-dark-secondary/0 flex justify-center">
                <RiContactsLine className="text-[28px]" />
              </span>
            </Contacts>
          </ul>
        </div>

        {/* Bottom or popup triiger */}
        <div className="flex flex-col gap-4 items-center text-[28px] opacity-80">
         <ColorThemeSelector/>
          <ModeToggle />

          <LogoutHandler>
            <div className="cursor-pointer">
              <AiOutlineLogout />
            </div>
          </LogoutHandler>
        </div>
      </div>
    </div>
  );
};

export default Aside;
