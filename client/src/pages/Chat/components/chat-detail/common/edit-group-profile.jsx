import { useState, useContext, useLayoutEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Icons
import { FiEdit2 } from "react-icons/fi";
// Context
import { ChatContext } from "@/context/chat-provider";
// Api
import { useEditGroupProfileMutation } from "@/api/services/chat.service";
// HOoks
import { useToast } from "@/hooks/use-toast";

const EditGroupProfile = () => {
  const { currentChat, setCurrentChat } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [groupName, setGroupName] = useState("");
  const [groupInfo, setGroupInfo] = useState("");
  const [avatarData, setAvatarData] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [editProfile, { isLoading }] = useEditGroupProfileMutation();

  useLayoutEffect(() => {
    if (currentChat) {
      setGroupName(currentChat.chatName);
      setGroupInfo(currentChat.info);
    }
  }, []);

  const handleSaveChange = async () => {
    if (groupName.length === 0) {
      return;
    }
    try {
      const res = await editProfile({
        chatName: groupName,
        info: groupInfo,
        chatId: currentChat._id,
      }).unwrap();
      setCurrentChat(res.data);

      toast({
        title: "Successfull",
        description: "Successfull",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Faild",
        description: error.data.message,
      });
    }
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <FiEdit2 />
          </Button>
        </DialogTrigger>

        <DialogContent className="h-fit ">
          <DialogHeader>
            <DialogTitle>Edit Group Profile</DialogTitle>
            <DialogDescription>
              Only Admin can access this action.
            </DialogDescription>

            <div className="w-full pt-4 flex flex-col gap-4 items-center">
              <div className="w-full flex flex-col flex-start  text-start gap-1">
                <Label>Group Name</Label>
                <Input
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col flex-start  text-start gap-1">
                <Label>Info (optional)</Label>
                <Textarea
                  className="h-[90px]"
                  placeholder="Enter something about your group"
                  onChange={(e) => setGroupInfo(e.target.value)}
                  value={groupInfo}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSaveChange} disabled={isLoading}>
              {isLoading ? "Loading..." : "Save Change"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditGroupProfile;
