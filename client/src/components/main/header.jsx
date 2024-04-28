// Components 👇🏼
import { Button } from "../ui/button";
import { ModeToggle } from "../common/mode-toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Lib 👇🏼
import { useSelector } from "react-redux";

// Icons 👇🏼
import { LucideMenu } from "lucide-react";
import NavigateTo from "@/handler/navigate-to";

const Header = () => {
  const { isLogedin } = useSelector((state) => state.auth);

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-[50px] border-b bg-black/10 backdrop-blur-lg px-4 md:px-10 z-40">
      <div className="w-full h-full flex justify-between items-center">
        {/* Left Content /Logo*/}
        <NavigateTo to="/">
          <h3 className="text-xl cursor-pointer">SolCial</h3>
        </NavigateTo>

        {/* Right Content */}
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center max-md:hidden">
            {isLogedin ? (
              <NavigateTo to="/chat">
                <Button className="w-full">Get Started</Button>
              </NavigateTo>
            ) : (
              <div className="flex items-center gap-2">
                <NavigateTo to="/login">
                  <Button>Login</Button>
                </NavigateTo>

                <NavigateTo to="/signup">
                  <Button variant="ghost">Signup</Button>
                </NavigateTo>
              </div>
            )}
          </div>

          {/* Theme Changeer */}
          <ModeToggle />

          {/* POpover for small screen */}
          <div className="flex gap-2 items-center md:hidden">
            <Popover>
              <PopoverTrigger>
                <LucideMenu />
              </PopoverTrigger>
              <PopoverContent className="h-fit w-fit md:hidden m-4 border">
                {isLogedin ? (
                  <NavigateTo to="/chat">
                    <Button className="w-full">Get Started</Button>
                  </NavigateTo>
                ) : (
                  <div className="flex flex-col items-center gap-2 w-full ">
                    <NavigateTo to="/login">
                      <Button className="w-[100px] ">Login</Button>
                    </NavigateTo>

                    <NavigateTo to="/signup">
                      <Button className="w-[100px]" variant="ghost">
                        Signup
                      </Button>
                    </NavigateTo>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
