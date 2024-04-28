import React, { useContext, useLayoutEffect, useState } from "react";
// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import AddMember from "./common/add-member";
import OnlineIndicator from "@/components/common/OnlineIndicator";
// Icons
import { AiFillStar } from "react-icons/ai";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
// Utils
import { isGroupAdmin, isGroupOwner } from "@/utils/chat-functionality";
// Hooks
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
// Context
import { ChatContext } from "@/context/chat-provider";
// Api
import {
  useAddAdminToGroupMutation,
  useRemoveUserFromGroupMutation,
} from "@/api/services/chat.service";

const GroupChatView = () => {
  const {
    currentChat,
    setCurrentChat,
    setIsCurrentChatDetailOpen,
    onlineUsers,
  } = useContext(ChatContext);
  const [members, setMembers] = useState([]);
  const loggedUserId = useSelector((state) => state.auth.authInfo._id);
  useLayoutEffect(() => {
    currentChat.isGroupChat && setMembers(currentChat.users);
  }, [currentChat]);
  const { toast } = useToast();
  const [removeUserFromGroup, { isLoading: isUserRemovingFromGroup }] =
    useRemoveUserFromGroupMutation();
  const handleRemoveUserFromGroup = async (userId) => {
    try {
      const res = await removeUserFromGroup({
        userId,
        chatId: currentChat._id,
      }).unwrap();
      console.log(res);
      setCurrentChat(res.data);
      toast({
        title: "Success",
        description: res.message,
      });
      setIsCurrentChatDetailOpen(true);
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: err.data.message,
      });
    }
  };

  const [addAdminToGroup, {}] = useAddAdminToGroupMutation();
  const handleAddAdminToGroup = async (userId) => {
    try {
      const res = await addAdminToGroup({
        userId,
        chatId: currentChat._id,
      }).unwrap();
      setCurrentChat(res.data);
      toast({
        title: "Success",
        description: res.message,
      });
    } catch (error) {
      toast({
        title: "Success",
        description: error.data.message,
      });
    }
  };
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Group Info */}

      <div className="flex flex-col gap-2">
        <Label>Info</Label>
        <h3 className="text-sm font-thin">
          {currentChat?.info ? currentChat.info : "No group info for yet!"}
        </h3>
      </div>

      {/* Members Setting and View */}
      <div className="flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <Label>Group Members</Label>
          <AddMember />
        </div>

        <div className="w-full flex flex-col gap-2">
          {members?.map((m, idx) => (
            <div key={m?._id} className="w-full flex justify-between">
              <div className="flex gap-2 items-center">
                <Avatar
                  className={`size-[30px] md:size-[30px] border-2 ${
                    isGroupAdmin(currentChat, m._id) && "border-primary "
                  }`}
                >
                  <AvatarFallback>{m.fullName[0]}</AvatarFallback>
                  <AvatarImage
                    src={import.meta.env.VITE_PROFILE_URL + m?.avatar?.url}
                  />
                </Avatar>

                <h3 className="text-sm">{m?.fullName}</h3>
                <div className="text-xs">
                  {onlineUsers.includes(m._id) && <OnlineIndicator />}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <div>
                  {isGroupAdmin(currentChat, m._id) ? (
                    <div className="flex gap-2 items-center">
                      <AiFillStar />
                      <h3 className="text-xs">
                        {isGroupOwner(currentChat, m._id) ? "Owner" : "Admin"}
                      </h3>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <h3 className="text-xs ">member</h3>
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  {currentChat.admins.includes(loggedUserId) &&
                    !isGroupAdmin(currentChat, m._id) && (
                      <DropdownMenu className="z-[100]">
                        <DropdownMenuTrigger>
                          <IoEllipsisVerticalOutline className="text-lg cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-fit">
                          <DropdownMenuItem
                            disabled={isUserRemovingFromGroup}
                            onClick={() => handleRemoveUserFromGroup(m._id)}
                            className="text-red-600 hover:text-red-500 transiton"
                          >
                            Remove from group
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAddAdminToGroup(m._id)}
                          >
                            Add to Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupChatView;
