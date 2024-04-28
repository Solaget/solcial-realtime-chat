import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { GoMute } from "react-icons/go";
import { twMerge } from "tailwind-merge";

const AudioPlayer = ({ src,size, className }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seekBarProgress, setSeekBarProgress] = useState(0);
  
  const handleAudioPlay = () => {
    setIsPlaying(true);
  };
  const handleAudioPause = () => {
    setIsPlaying(false);
  };
  const handleTimeUpdate = () => {
    const _currentTime = Math.ceil(audioRef.current.currentTime);
    const _duration = Math.ceil(audioRef.current.duration);

    setSeekBarProgress((_currentTime / _duration) * 100);
  };
  const handleVolumeMute = () => {
    audioRef.current.muted = true;
    setIsMuted(audioRef.current.muted);
  };
  const handleVolumeUp = () => {
    audioRef.current.muted = false;
    setIsMuted(audioRef.current.muted);
  };


  const pauseOthersAudios = () => {
    const allAudios = document.querySelectorAll("#audio-player");
    allAudios.forEach((audio) => {
      if (audio === audioRef.current) return;

      audio.pause();
    });
  };

  const handleStartPlay = () => {
    audioRef.current.play();
  };
  const handleStopPlay = () => {
    audioRef.current.pause();
  };
  return (
    <div className={twMerge(`flex relative w-[200px] p-1 ${className}`)}>
      <div className="flex items-center gap-2 flex-1">
        {!isPlaying ? (
          <span
            className="z-50 size-[35px] rounded-full grid place-content-center bg-slate-500 cursor-pointer"
            onClick={handleStartPlay}
          >
            <FaPlay className="text-[15px] text-white" />
          </span>
        ) : (
          <span
            className="z-50 size-[35px] rounded-full grid place-content-center bg-slate-500 cursor-pointer"
            onClick={handleStopPlay}
          >
            <FaPause className="text-[15px] text-white" />
          </span>
        )}

        <div className="flex flex-col flex-1 justify-center gap-1">
          <h4 className="text-xs leading-none text-black dark:text-primary-foreground">{size}</h4>
          <div
            style={{ width: `${seekBarProgress}%` }}
            className={`h-[3px] bg-black dark:bg-white transition`}
          />
        </div>
      </div>

      <audio
        id="audio-player"
        ref={audioRef}
        src={src}
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="pr-1 pt-1">
        {!isMuted ? (
          <span className="cursor-pointer" onClick={handleVolumeMute}>
            <FaVolumeUp />
          </span>
        ) : (
          <span className="cursor-pointer" onClick={handleVolumeUp}>
            <FaVolumeMute />
          </span>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
