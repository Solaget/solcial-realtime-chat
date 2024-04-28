const fileSizeConvertor = (size) => {
  const kb_size = size / 1000;
  let output = 0;
  if (kb_size > 1024) {
    output = (kb_size / 1000).toFixed(2) + " " + "mb";
  } else {
    output = kb_size.toFixed(2) + " " + "kb";
  }

  return output;
};
export default fileSizeConvertor;
