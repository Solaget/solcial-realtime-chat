// Emoji lib
import EmojiPicker from "@emoji-mart/react";
import EmojiData from "@emoji-mart/data";
// Icons
import { Smile, } from "lucide-react";
// Components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EmojiPickerBox = ({ setMessageInputValue }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-[17px] cursor-pointer hover:scale-110 transition" />
      </PopoverTrigger>
      <PopoverContent className="max-sm:p-0  max-sm:w-full w-fit" align="right">
        <EmojiPicker
          data={EmojiData}
          onEmojiSelect={(e) => {
            setMessageInputValue((prev) => prev + e.native);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerBox;
