// Time Converter 👇🏼
export const timeFormatter = (time) => {
  if (!time) return time;
  const date = new Date(time);
  const localTime = date.toLocaleTimeString("zh-TW", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return localTime;
};
