import { useContext, useEffect, useState } from "react";
// Components 👇🏼
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpinnerLoader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Icons 👇🏼
import {
  AiOutlineUsergroupAdd,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiFillCloseSquare,
  AiOutlineDelete,
} from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { X } from "lucide-react";
// Api 👇🏼
import { useLazySerachUsersQuery } from "@/api/services/users.service";
// Lib 👇🏼
import { twMerge } from "tailwind-merge";
import { ChatContext } from "@/context/chat-provider";
import {
  useAddUserToContactMutation,
  useRemoveUserFromContactMutation,
  useGetContactsQuery,
} from "@/api/services/contact.service";
import ChatSkeletonLoader from "../common/chat-skeleton-loader";
import { useAccessChatMutation } from "@/api/services/chat.service";
import { useToast } from "@/hooks/use-toast";

const Contacts = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { setCurrentChat } = useContext(ChatContext);
  const [userEmail, setUserEmail] = useState("");
  const {
    data: contactsData,
    isError,
    isLoading,
    refetch,
  } = useGetContactsQuery();
  const [_accessChat, {}] = useAccessChatMutation();

  const [addNewContact, { isLoading: isAdding }] =
    useAddUserToContactMutation();
  const [removeFromContact, { isLoading: isRemoving }] =
    useRemoveUserFromContactMutation();

  const handleAddNewContact = async () => {
    try {
      const res = await addNewContact({ userEmail }).unwrap();
    } catch (err) {
      toast({
        title: "Error",
        description: err.data.message,
      });
    }
  };

  const handleRemoveFromContact = async (userEmailToRemove) => {
    try {
      await removeFromContact({ userEmail: userEmailToRemove });
    } catch (err) {
      toast({
        title: "Error",
        description: err.data.message,
      });
    }
  };

  const accessChat = async (userId) => {
    const res = await _accessChat(userId).unwrap();
    setCurrentChat(res);
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        withCloseBtn={false}
        className="border-2 flex flex-col pt-2 px-3 h-[60vh] w-[400px] max-sm:w-screen max-sm:h-[100vh]"
      >
        <div className="flex items-center sm:justify-center gap-2">
          <Button
            variant="ghost"
            className="sm:hidden"
            onClick={() => setIsOpen(false)}
          >
            <AiOutlineArrowLeft />
          </Button>
          <h3 className="text-lg">Contacts</h3>
        </div>
        <div>
          <div className="w-full flex gap-2 pt-2">
            <Input
              className="flex-1"
              onChange={(e) => setUserEmail(e.target.value.trim())}
              placeholder="Enter user email"
            />
            <Button onClick={handleAddNewContact} disabled={isAdding}>
              Add
            </Button>
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full overflow-y-scroll flex-1 relative">
          {isError ? (
            <div className="py-4 flex justify-center">
              <h3>Error Occured</h3>
            </div>
          ) : isLoading ? (
            <ChatSkeletonLoader length={4} />
          ) : contactsData.length > 0 ? (
            contactsData.map((user, idx) => (
              <div
                className="w-full flex justify-between gap-1 "
                key={user._id}
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                    <AvatarImage
                      src={import.meta.env.VITE_PROFILE_URL + user?.avatar.url}
                    />
                  </Avatar>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm leading-none">{user.fullName}</h3>
                    <h3 className="text-xs leading-none">{user.email}</h3>
                  </div>
                </div>

                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => accessChat(user._id)}
                  >
                    <BsChatDots />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromContact(user.email)}
                    disabled={isRemoving}
                  >
                    <AiOutlineDelete />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 flex justify-center">
              <h3>There is no any contact</h3>
            </div>
          )}
        </ul>{" "}
      </DialogContent>
    </Dialog>
  );
};

export default Contacts;
