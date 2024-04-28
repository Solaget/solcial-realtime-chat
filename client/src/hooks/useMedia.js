import { useState, useEffect } from "react";

const useMedia = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const handleChange = () => setMatches(media.matches);

    handleChange();

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);
  return matches;
};

export default useMedia;
