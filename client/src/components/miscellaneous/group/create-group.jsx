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
} from "react-icons/ai";
import { X } from "lucide-react";
// Api 👇🏼
import { useLazySerachUsersQuery } from "@/api/services/users.service";
import { useCreateGroupChatMutation } from "@/api/services/chat.service";
// Lib 👇🏼
import { twMerge } from "tailwind-merge";
import { ChatContext } from "@/context/chat-provider";

const CreateGroup = ({ children }) => {
  const { setCurrentChat } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const [groupNameValue, setGroupNameValue] = useState("");
  const [showStepTwo, setShowStepTwo] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [
    searchUsers,
    { isError: isSearchError, data: searchResult, isFetching },
  ] = useLazySerachUsersQuery();
  const [searchValue, setSearchValue] = useState("");

  // Step One Functions!
  const handleSaveGroupName = () => {
    if (groupNameValue.length > 2) {
      setShowStepTwo(true);
    }
  };

  // Step Two Functions!
  const [
    creategroup,
    {
      isLoading: isGroupCreating,
      data: groupCreateData,
      isError: isGroupCreateError,
      isSuccess: isGroupCreated,
    },
  ] = useCreateGroupChatMutation();

  const handleCreateGroup = async () => {
    if (!groupNameValue) return;
    if (selectedMembers.length === 0) return;

    // Send request to endpoint to create new group
    const members = selectedMembers.map((m) => m._id);
    const body = { users: members, chatName: groupNameValue };
    const res=await creategroup(body).unwrap();
    console.log(res)
    setCurrentChat(res);

  };

  const handleBackToStepOne = () => {
    setShowStepTwo(false);
    setSearchValue("");
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    await searchUsers(value);
  };

  const handleSelectMember = (user) => {
    const isSelected = selectedMembers.some((m) => m._id === user._id);
    if (isSelected) {
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

  const clearHistory = () => {
    setGroupNameValue("");
    setShowStepTwo(false);
    setSelectedMembers([]);
    searchUsers("");
    setSearchValue("");
  };
  useEffect(() => {
    if (isGroupCreated) {
      setIsOpen(false);
      clearHistory();
    }
  }, [isGroupCreated]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-fit">
        {!showStepTwo ? (
          <>
            {/* ----Step one--- */}
            <DialogHeader>
              <DialogTitle>Create new group</DialogTitle>
              <DialogDescription>
                Write name for your group name
              </DialogDescription>
              <div className="flex flex-col gap-2 w-full py-4">
                <Input
                  placeholder="Group name"
                  value={groupNameValue}
                  onChange={(e) => setGroupNameValue(e.target.value)}
                />
              </div>
            </DialogHeader>

            <div className="grid place-content-end w-full py-4">
              {groupNameValue.length > 2 && (
                <Button
                  className="size-[50px] rounded-full"
                  onClick={handleSaveGroupName}
                >
                  <AiOutlineArrowRight />
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {/* ----- Step2 ----- */}
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
                    <div className="flex flex-col items-center" key={user._id}>
                      <Avatar className="border-2 border-primary">
                        <AvatarFallback>{user.fullName.at(0)}</AvatarFallback>
                        <AvatarImage
                          src={
                            import.meta.env.VITE_PROFILE_URL + user?.avatar.url
                          }
                        />
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
                      key={user._id}
                      className="w-full py-1 px-1 flex justify-between items-center "
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar>
                          <AvatarFallback>{user.fullName.at(0)}</AvatarFallback>
                          <AvatarImage
                            src={
                              import.meta.env.VITE_PROFILE_URL +
                              user?.avatar.url
                            }
                          />
                        </Avatar>
                        <div className="text-sm leading-none">
                          <h3>{user.fullName}</h3>
                          <h3>{user.email}</h3>
                        </div>
                      </div>

                      <div>
                        {selectedMembers.some((m) => m._id === user._id) ? (
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
                className="w-[50px] h-[50px] rounded-full"
                onClick={handleBackToStepOne}
              >
                <AiOutlineArrowLeft />
              </Button>
              <Button
                className="w-fit h-[50px] rounded-full"
                onClick={handleCreateGroup}
              >
                Create group
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
