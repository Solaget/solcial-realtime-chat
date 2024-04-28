import { useState, useContext, useEffect } from "react";
// Components
import SingleChat from "./common/single-chat";
import SearchContainer from "./common/search-container";
import NavSheet from "./common/nav-sheet";
import ChatSkeletonLoader from "@/components/common/chat-skeleton-loader";
// Context
import { ChatContext } from "@/context/chat-provider";
// Lib hooks
import { useSelector } from "react-redux";
import { useFetchChatsQuery } from "@/api/services/chat.service";

const ChatsListContainer = () => {
  const { data, isLoading, isError, refetch } = useFetchChatsQuery();
  const [currentData, setCurrentData] = useState([]);
  const [currentTab, setCurrentTab] = useState("all");
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);

  useEffect(() => {
    if (!data) return;
    if (currentTab === "all") {
      setCurrentData(data);
    } else if (currentTab === "favorite") {
      const filterdData = data.filter((c) => {
        return c?.favorite.toString() === loggedUserId;
      });
      setCurrentData(filterdData);
    } else if (currentTab === "group") {
      const filterdData = data.filter((c) => {
        return c?.isGroupChat === true;
      });
      setCurrentData(filterdData);
    } else if (currentTab === "private") {
      const filterdData = data.filter((c) => {
        return c?.isGroupChat !== true;
      });
      setCurrentData(filterdData);
    }
  }, [data, currentTab]);

  const handleChangeTab = (to) => {
    setCurrentTab(to);
  };

  return (
    <div className="w-full h-full pb-4">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b-2 py-3 px-4 max-md:bg-secondary">
          <div className="md:hidden">
            <NavSheet />
          </div>
          <h3 className="text-lg sm:text-xl">Chats</h3>
          {/* Search bar */}
          <SearchContainer />
        </div>

        {/* Navigator Tabs */}
        <div className="flex items-center gap-1 max-h-[30px] overflow-x-hidden w-full px-2 md:px-4">
          {["all", "private", "group", "favorite"].map((itm, i) => (
            <div
              key={new Date() / i}
              className={`flex items-center min-w-fit max-h-[80%] text-black dark:text-white capitalize px-2 rounded-lg cursor-pointer transition-all  ${
                currentTab === itm && "bg-primary text-white"
              }`}
            >
              <h3 className="text-sm" onClick={() => handleChangeTab(itm)}>
                {itm}
              </h3>
            </div>
          ))}
        </div>

        {/* Chats wrapper */}
        <ul className="flex flex-col w-full overflow-y-scroll flex-1 relative">
          {isError ? (
            <div className="py-4 flex justify-center">
              <h3>Error Occured</h3>
            </div>
          ) : isLoading ? (
            <ChatSkeletonLoader length={8} />
          ) : currentData.length > 0 ? (
            currentData.map((chat, idx) => <SingleChat data={chat} key={chat._id} />)
          ) : (
            <div className="py-4 flex justify-center">
              {currentTab == "favorite" ? (
                <h3>There is no favorite chat</h3>
              ) : (
                <h3>There is no any chat</h3>
              )}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatsListContainer;
