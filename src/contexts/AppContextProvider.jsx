import { createContext, useEffect, useState } from "react";
import { loadFFmpeg } from "../helpers/utils";

export const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [ffmpeg, setFFmpeg] = useState(null);

  useEffect(() => {
    const initAsync = async () => {
      if (!ffmpeg) {
        const ffmpegResponse = await loadFFmpeg();
        console.log(ffmpegResponse);
        setFFmpeg(ffmpegResponse);
      }
    };

    initAsync();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ffmpeg,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
