import { useContext } from "react";
// Components 👇🏼
import { Button } from "@/components/ui/button";
// Lib 👇🏼
import { useSelector } from "react-redux";
// Icons 👇🏼
import { GoStar, GoStarFill } from "react-icons/go";
// Api 👇🏼
import { useToggleFavoriteChatMutation } from "@/api/services/chat.service";
// Context 👇🏼
import { ChatContext } from "@/context/chat-provider";
// Utils 👇🏼
import { isMyFavoriteChat } from "@/utils/chat-functionality";

const ToggleFavorite = ({ title, chatId }) => {
  const [toggleFav, { data, isLoading }] = useToggleFavoriteChatMutation();
  const authInfo = useSelector((state) => state.auth.authInfo);
  const { setCurrentChat, currentChat } = useContext(ChatContext);

  const handleToggleFavorite = async () => {
    try {
      const res = await toggleFav({ chatId }).unwrap();
      setCurrentChat(res.data);
    } catch (error) {}
  };

  return title ? (
    <div onClick={handleToggleFavorite} className="w-full">
      {title}
    </div>
  ) : (
    <Button variant="ghost" onClick={handleToggleFavorite} size="icon">
      {isMyFavoriteChat(currentChat, authInfo._id) ? (
        <GoStarFill className="text-lg text-primary" />
      ) : (
        <GoStar className="text-lg" />
      )}
    </Button>
  );
};

export default ToggleFavorite;
