import { useState, useContext } from "react";
// Components
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import ChatSkeletonLoader from "@/components/common/chat-skeleton-loader";
// Icons
import { AiOutlineSearch } from "react-icons/ai";
// Api
import { useLazySerachUsersQuery } from "@/api/services/users.service";
import { useAccessChatMutation } from "@/api/services/chat.service";
// Context
import { ChatContext } from "@/context/chat-provider";

const SearchContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchUsers, { isLoading, isError, data, isFetching }] =
    useLazySerachUsersQuery();

  const { setCurrentChat, setIsCurrentChatDetailOpen } =
    useContext(ChatContext);

  const [_accessChat, {}] = useAccessChatMutation();
  const accessChat = async (userId) => {
    const res = await _accessChat(userId).unwrap();
    setCurrentChat(res);
    setIsCurrentChatDetailOpen(false);
    setIsOpen(false);
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value.toLowerCase());
    await searchUsers(value);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} variants="left">
      <SheetTrigger asChild>
        <span className="grid place-content-center">
          <AiOutlineSearch className="text-xl cursor-pointer" />
        </span>
      </SheetTrigger>

      <SheetContent className="max-sm:w-full h-full flex flex-col">
        <div className="pt-4 w-full flex flex-col gap-2">
          <SheetHeader>
            <SheetTitle>Find your freinds now</SheetTitle>
            <SheetDescription>
              Click the user profile and access chat now
            </SheetDescription>
            <div className="flex w-full pr-4 px-2 h-[35px] bg-muted rounded-full">
              <span className="px-2 grid place-content-center">
                <AiOutlineSearch />
              </span>
              <input
                type="text"
                className="size-full outline-none border-none flex-1 bg-transparent"
                placeholder="Search here"
                onChange={handleSearchInputChange}
                value={searchValue}
              />
            </div>
          </SheetHeader>

          <div className="mt-4 flex gap-2">
            {isError ? (
              <h3 className="text-center">Some error occurd</h3>
            ) : isFetching ? (
              <ChatSkeletonLoader length={8} />
            ) : data && data?.length >= 1 ? (
              <div className="flex flex-col w-full max-h-[60vh] overflow-y-scroll">
                {data.map((user) => (
                  <div
                    key={user._id}
                    className="w-full py-2 hover:bg-muted transition cursor-pointer"
                    onClick={() => accessChat(user._id)}
                  >
                    <div className="w-full flex items-center gap-1">
                      <Avatar>
                        <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                        <AvatarImage
                          src={
                            import.meta.env.VITE_PROFILE_URL + user?.avatar.url
                          }
                        />
                      </Avatar>

                      <h3 className="text-sm">{user.fullName}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchValue.length <= 1 ? (
              ""
            ) : (
              "No found"
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SearchContainer;
