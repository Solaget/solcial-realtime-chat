// Components 👇🏼
import SettingAside from "@/components/main/setting-aside";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Lib 👇🏼
import { Outlet } from "react-router-dom";
// Icons 👇🏼
import { LucideMenu } from "lucide-react";
import { IoMdArrowBack } from "react-icons/io";
// Handler 👇🏼
import NavigateTo from "@/handler/navigate-to";

const SettingsLayout = () => {
  return (
    <div className="p-5 pt-0 w-full overflow-y-scroll h-screen">
      <div className="flex flex-col gap-8 h-full w-full">

        {/* Layout Header 👇🏼 */}
        <header className="z-[10] w-full flex justify-between items-center sticky top-0 left-0 right-0 bg-background border-b pt-9 py-4">
          <div className="flex gap-4 items-start">
            <NavigateTo to="/chat">
              <span className="cursor-pointer md:hidden">
                <IoMdArrowBack className="text-xl mt-6" />
              </span>
            </NavigateTo>
            <div className="flex flex-col">
              <h3 className="text-[27px] font-semibold">Settings</h3>
              <p className="text-muted-foreground text-md">
                Manage your account settings and set-up email prefrences
              </p>
            </div>
          </div>

          {/* Nav links in popover for small screen 👇🏼 */}
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger>
                <LucideMenu />
              </PopoverTrigger>
              <PopoverContent className="h-fit md:hidden m-4 border">
                <SettingAside />
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <div className="flex flex-1 gap-6 h-full">
          {/* Layout Sidebar  👇🏼*/}
          <div className="w-[25%] max-md:hidden">
            <SettingAside />
          </div>

          {/* Page Containers 👇🏼 */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
