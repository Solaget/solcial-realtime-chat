export const getSenderInfo = (chat, loggedUserId) => {
  return chat?.users[0]?._id === loggedUserId ? chat?.users[1] : chat?.users[0];
}
export const getChatDisplayInfo = (chat, loggedUserId) => {
  return chat?.users[0]?._id === loggedUserId ? chat?.users[1] : chat?.users[0];
};
export const isGroupAdmin = (chat, userId) => {
  return chat.isGroupChat && chat.admins.some((itm) => itm === userId);
};
export const isGroupOwner = (chat, userId) => {
  return chat.isGroupChat && chat.owner === userId;
};
export const isMyMessage = (senderId, loggedUserId) => {
  return senderId === loggedUserId;
};
export const isMyFavoriteChat = (chat, loggedUserId) => {
  return chat?.favorite.includes(loggedUserId);
};
