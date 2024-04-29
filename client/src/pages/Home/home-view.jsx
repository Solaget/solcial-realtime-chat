//Lib Hooks 👇🏼
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// Components 👇🏼
import { Button } from "@/components/ui/Button";
// Icons
import { FaGithub } from "react-icons/fa";

const HomeView = () => {
  const navigate = useNavigate();
  const { isLogedin } = useSelector((state) => state?.auth);

  const handleNavigate = (navigateTo) => {
    navigate(navigateTo);
  };

  const handleGoToGithub = () => {
    window.open("https://github.com/Solaget");
  };

  return (
    <div className="h-screen pt-20 sm:px-15">
      <div className="h-full flex flex-col items-center justify-between w-full px-2 sm:px-40">
        <div className="flex flex-col max-md:text-center items-center">
          {/* Title And Desc */}
          <div className="flex flex-col gap-2 items-center text-center ">
            <h3 className="text-4xl font-bold">
              Share the world with your{" "}
              <span className="underlined">freinds</span>
            </h3>
            <p className="text-lg text-muted-foreground px-4 w-[90%] sm:w-[60%]">
              Chat App lets you connect with the world Solcial is more than just
              a chat app—it's a platform designed to cater to all your
              communication needs. With a plethora of features, Solcial offers a
              comprehensive and seamless chatting experience like no other.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5">
            {isLogedin ? (
              <Button
                onClick={() => handleNavigate("/chat")}
                className="rounded px-10 py-3 w-fit mt-2"
              >
                Get Started
              </Button>
            ) : (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  className="w-full mt-2"
                  onClick={() => handleNavigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className=" w-full mt-2"
                  variant="outline"
                  onClick={() => handleNavigate("/signup")}
                >
                  Signup
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon" onClick={handleGoToGithub}>
            <FaGithub className="text-2xl" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
