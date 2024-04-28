import { useContext, useEffect, useRef, useState } from "react";
// Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SpinnerLoader } from "@/components/ui/loader";
// Icons
import { Mic } from "lucide-react";
// Api
import { useSendMessageMutation } from "@/api/services/message.service";
// Context
import { ChatContext } from "@/context/chat-provider";
// Socket
import { socket } from "@/App";

const VoiceRecorder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    currentChat,
    setMessages,
    messages,
    toReplyMessage,
    setToReplyMessage,
  } = useContext(ChatContext);

  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    clearHistory();
  }, [currentChat, isOpen]);

  const startRecording = async () => {
    // clearHistory();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        setAudioChunks([...audioChunks, e.data]);
      };
      mediaRecorder.start();
      setAudioStream(stream);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = async () => {
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }
    setRecording(false);
  };

  const clearHistory = () => {
    setAudioChunks([]);
    setAudioStream(null);
    setRecording(false);
  };

  const sendVoice = async () => {
    // Convert audio chunks to a single Blob
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    // Create FormData object and append audio file
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.webm");
    formData.append("contnet", "audioBlob");
    formData.append("chatId", currentChat._id);
    if (toReplyMessage) {
      formData.append("repliedMessage", toReplyMessage._id);
    }
    try {
      const res = await sendMessage(formData);
      setIsOpen(false);
      setToReplyMessage(null);
      clearHistory();
      setMessages([...messages, res.data]);
      socket && socket.emit("send message", res.data);
    } catch (error) {}
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Mic className="text-[17px] cursor-pointer hover:scale-110 transition" />
      </PopoverTrigger>
      <PopoverContent className="max-sm:p-4 max-sm:w-full w-fit" align="right">
        <div className="w-full flex flex-col items-center pt-2">
          {!recording && audioChunks.length == 0 && (
            <button
              className={`flex items-center justify-center rounded-full size-[50px] bg-[whitesmoke] focus:outline`}
              onClick={startRecording}
            >
              <Mic className="text-black animate-pulse" />
            </button>
          )}

          {recording && (
            <Button
              onClick={stopRecording}
              className="animate-pulse flex items-center justify-center rounded-full size-[50px]"
            >
              Stop
            </Button>
          )}

          {!recording && audioChunks.length >= 1 && (
            <Button onClick={sendVoice} className="w-full" disabled={isLoading}>
              {isLoading ? <SpinnerLoader /> : "Send"}
            </Button>
          )}
          {!recording && audioChunks.length >= 1 && (
            <Button variant="ghost" onClick={clearHistory} className="w-full">
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceRecorder;
