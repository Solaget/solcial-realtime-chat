import { useContext, useEffect, useRef, useState } from "react";
// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Icons
import { Link } from "lucide-react";
// Api
import { useSendMessageMutation } from "@/api/services/message.service";
// Context
import { ChatContext } from "@/context/chat-provider";
// Socket
import { socket } from "@/App";
// Hooks
import { useToast } from "@/hooks/use-toast";

const FileSelector = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentChat,
    setMessages,
    messages,
    toReplyMessage,
    setToReplyMessage,
  } = useContext(ChatContext);

  const [file, setFile] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [messageValue, setMessageValue] = useState("");
  const fileInputRef = useRef();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const clearHistory = () => {
    setFile("");
    setFilePreview("");
    setMessageValue("");
  };

  const handleSendMessage = async () => {
    let formData = new FormData();
    if (!file) return;
    if (!messageValue) return;
    formData.append("file", file);
    formData.append("content", messageValue);
    formData.append("type", "message");
    formData.append("chatId", currentChat._id);
    if (toReplyMessage) {
      formData.append("repliedMessage", toReplyMessage._id);
    }

    try {
      const data = await sendMessage(formData).unwrap();

      clearHistory();
      setIsOpen(false);
      setToReplyMessage(null);
      setMessages([...messages, data]);
      socket && socket.emit("send message", data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Message not send for yet, Please Try again later!",
      });
    }
  };

  useEffect(() => {
    clearHistory();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Link className="text-[17px] cursor-pointer hover:scale-110 transition " />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select File</DialogTitle>
          <DialogDescription>
            Select image from your file and share for you freinds
          </DialogDescription>

          <div className="flex w-full">
            {!file ? (
              <div className="w-full pt-2">
                <Button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-invert text-invert-foreground w-full"
                >
                  Select from your file
                </Button>
                <input
                  type="file"
                  id="file-selector"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png"
                  multiple={false}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col gap-2">
                <div className="w-full h-[300px] bg-gray-400 rounded-lg grid place-content-center">
                  <img
                    className="object-cover min-h-[100px] max-h-full max-w-full"
                    src={filePreview}
                  />
                </div>
                <Input
                  placeholder="Write something here..."
                  className="w-full"
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                />
                <Button
                  className="w-full bg-invert text-invert-foreground mt-2"
                  disabled={isLoading}
                  onClick={handleSendMessage}
                >
                  {isLoading ? "Loading..." : "Send now"}
                </Button>
                <Button
                  className="w-full mt-2"
                  variant="ghost"
                  onClick={clearHistory}
                >
                  Clear Selected file
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FileSelector;
