// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import CreateGroup from "@/components/miscellaneous/group/create-group";
import { ModeToggle } from "@/components/common/mode-toggle";
import ColorThemeSelector from "@/components/common/color-theme-selector";
// Lib Hooks
import { useSelector } from "react-redux";
// Icons
import { AiOutlineUsergroupAdd, AiOutlineLogout } from "react-icons/ai";
import { FaFingerprint } from "react-icons/fa";
import { LiaUserEditSolid } from "react-icons/lia";
import { TbColorPicker } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
// Handler
import LogoutHandler from "@/handler/logout";
import NavigateTo from "@/handler/navigate-to";
import Contacts from "@/components/miscellaneous/contacts";

const NavSheet = () => {
  const authInfo = useSelector((state) => state.auth.authInfo);
  let actionClassName =
    "w-full flex items-center gap-2 py-3 px-2 cursor-pointer border-b text-xs hover:bg-muted";
  return (
    <Sheet className="md:hidden">
      <SheetTrigger>
        <Avatar className="size-[35px] md:hidden cursor-pointer">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {authInfo.fullName[0]}
          </AvatarFallback>
          <AvatarImage
            src={import.meta.env.VITE_PROFILE_URL + authInfo.avatar.url}
          />
        </Avatar>
      </SheetTrigger>

      <SheetContent side="left" className="w-[50%] p-0">
        <div className="w-full flex flex-col justify-between h-full">
          <div className="flex flex-col w-full">
            {/* Profile Contents */}
            <div className="relative w-full flex flex-col gap-2 py-4 px-2 bg-secondary">
              <Avatar className="size-[35px] md:hidden cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {authInfo.fullName[0]}
                </AvatarFallback>
                <AvatarImage
                  src={import.meta.env.VITE_PROFILE_URL + authInfo.avatar.url}
                />
              </Avatar>
              <div>
                <h3 className="text-md leading-none">{authInfo?.fullName}</h3>
                <h3 className="text-xs text-muted-foreground leading-tight">
                  {authInfo?.email}
                </h3>
              </div>

              {/* Theme Mode Toggler */}
              <div className="absolute bottom-4 right-2 flex items-center gap-1 ">
                <ColorThemeSelector colorCircleSize="size-[25px]"/>
                <ModeToggle className="bg-transparent" />
              </div>
            </div>

            <div className="w-full flex flex-col pt-2">
              <CreateGroup>
                <div className={actionClassName}>
                  <span>
                    <AiOutlineUsergroupAdd className="text-[20px]" />
                  </span>
                  Create new Group
                </div>
              </CreateGroup>

              <Contacts>
                <div className={actionClassName}>
                  <span>
                    <RiContactsLine className="text-[20px]" />
                  </span>
                  Contacts
                </div>
              </Contacts>

              <NavigateTo to="/setting/profile">
                <div className={actionClassName}>
                  <span>
                    <LiaUserEditSolid className="text-[20px]" />
                  </span>
                  Update Profile
                </div>
              </NavigateTo>

              <NavigateTo to="/setting/privacy-security">
                <div className={actionClassName}>
                  <span>
                    <FaFingerprint className="text-[20px]" />
                  </span>
                  Privacy And Security
                </div>
              </NavigateTo>

              <NavigateTo to="/setting/theme">
                <div className={actionClassName}>
                  <span>
                    <TbColorPicker className="text-[20px]" />
                  </span>
                  Change Theme
                </div>
              </NavigateTo>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col gap-1">
            <LogoutHandler>
              <div className={actionClassName}>
                <span>
                  <AiOutlineLogout className="text-[20px]" />
                </span>
                Logout
              </div>
            </LogoutHandler>

            <p className="text-xs text-center opacity-75 hover:opacity-100 transition px-2">
              Created by Solomon Getnet
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavSheet;
