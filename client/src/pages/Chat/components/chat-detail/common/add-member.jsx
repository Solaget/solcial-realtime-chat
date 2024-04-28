import { useContext, useLayoutEffect, useState } from "react";
// Components
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SpinnerLoader } from "@/components/ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Api
import { useLazySerachUsersQuery } from "@/api/services/users.service";
import { useAddMemberToGroupMutation } from "@/api/services/chat.service";
// Context
import { ChatContext } from "@/context/chat-provider";
// Hook
import { useToast } from "@/hooks/use-toast";

const AddMember = () => {
  const { currentChat, setCurrentChat, setIsCurrentChatDetailOpen } =
    useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentMembers, setCurrentMembers] = useState([]);
  const [
    searchUsers,
    { isLoading, isError: isSearchError, data: searchResult, isFetching },
  ] = useLazySerachUsersQuery();
  const [searchValue, setSearchValue] = useState("");

  useLayoutEffect(() => {
    setCurrentMembers(currentChat.users);
  }, []);

  const [
    addMembers,
    {
      isLoading: isMemberAdding,
      isError: memberAddingError,
      isSuccess: isMemberAddSuccess,
    },
  ] = useAddMemberToGroupMutation();

  const { toast } = useToast();
  const handleAddToGroup = async () => {
    if (selectedMembers.length === 0) return;

    const members = selectedMembers.map((m) => m._id);
    const body = { users: members, chatId: currentChat._id };

    try {
      const res = await addMembers(body).unwrap();
      setCurrentChat(res.data);
      setIsCurrentChatDetailOpen(false);
      console.log(res.data);
      toast({
        title: " Success",
        description: res.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    await searchUsers(value);
  };

  const handleSelectMember = (user) => {
    const isSelected = selectedMembers.some((m) => m._id === user._id);
    if (isSelected) {
      alert("Selected Before");
      return;
    }
    setSelectedMembers((prev) => {
      return [...prev, user];
    });
  };

  const handleRemoveSelectedMember = (user) => {
    const updatedMemebers = selectedMembers.filter((m) => m._id !== user._id);
    setSelectedMembers(updatedMemebers);
  };

  const handleClearSelectedMembers = () => {
    setSelectedMembers([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="text" variant="link">
          Add member
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit">
        <>
          <DialogHeader className="max-w-full overflow-hidden">
            <DialogTitle>Add members</DialogTitle>
            <DialogDescription>
              Find your friends then Add in the group
            </DialogDescription>
          </DialogHeader>

          {/* Selected Memebers Preview */}
          {selectedMembers.length >= 1 && (
            <div className="w-full flex flex-col gap-1 ">
              <div className="w-full flex items-center justify-between">
                <h3 className="text-sm">{selectedMembers.length} members</h3>
                <Button variant="link" onClick={handleClearSelectedMembers}>
                  clear
                </Button>
              </div>

              <div className="flex gap-1 overflow-x-scroll max-w-[100%] flex-wrap ">
                {selectedMembers.map((user, idx) => (
                  <div className="flex flex-col items-center" key={idx}>
                    <Avatar>
                      <AvatarFallback>{user.fullName.at(0)}</AvatarFallback>
                      <AvatarImage src={import.meta.env.VITE_PROFILE_URL + user?.avatar.url} />
                    </Avatar>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search input */}
          <div className="flex flex-col gap-2 w-full py-4">
            <Input
              placeholder="Search members"
              value={searchValue}
              onChange={handleSearchInputChange}
            />
          </div>

          {/*Search Result Box */}
          <div className="pt-4 flex justify-center">
            {isSearchError ? (
              <h2>Error occured</h2>
            ) : isFetching ? (
              <SpinnerLoader />
            ) : searchResult?.length >= 1 ? (
              <div className="w-full max-h-[200px] overflow-scroll flex flex-col">
                {searchResult?.map((user, idx) => (
                  <div
                    key={idx}
                    className="w-full py-1 px-1 flex justify-between items-center "
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarFallback>{user.fullName.at(0)}</AvatarFallback>
                        <AvatarImage src={import.meta.env.VITE_PROFILE_URL + user?.avatar.url} />
                      </Avatar>
                      <div className="text-sm leading-none">
                        <h3>{user.fullName}</h3>
                        <h3>{user.email}</h3>
                      </div>
                    </div>

                    <div>
                      {currentMembers.some((m) => m._id === user._id) ? (
                        <h2 className="text-sm text-primary">member</h2>
                      ) : selectedMembers.some((m) => m._id === user._id) ? (
                        <Button
                          className="text-xs"
                          variant="ghost"
                          onClick={() => handleRemoveSelectedMember(user)}
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          className="text-xs"
                          variant="ghost"
                          onClick={() => handleSelectMember(user)}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              searchValue.length >= 1 && <h3>No user found</h3>
            )}
          </div>

          {/* Footer */}
          <div className="w-full flex justify-between">
            <Button
              className="w-full h-[50px] bg-invert text-invert-foreground"
              onClick={handleAddToGroup}
              disabled={isMemberAdding}
            >
              Add Members
            </Button>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
