import React, { useRef, useState } from "react";
import { IoPlayCircle, IoPauseCircle, IoEllipse } from "react-icons/io5";

export default function CustomAudioPlayer({ audioUri }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    if (audio.ended) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg max-w-md mx-auto shadow-md">
      <audio
  ref={audioRef}
  preload="auto"
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={() => setDuration(audioRef.current.duration)}
>
  <source src={audioUri} type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>


      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="text-white focus:outline-none"
        >
          {isPlaying ? <IoPauseCircle size={40} /> : <IoPlayCircle size={40} />}
        </button>

        {/* Slider */}
        <div className="w-full relative">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 appearance-none"
            style={{
              WebkitAppearance: "none",
            }}
          />
          <IoEllipse
            size={16}
            color="#10b981"
            className="absolute"
            style={{
              top: "-8px",
              left: `${(currentTime / duration) * 100}%`,
              transform: "translate(-50%)",
            }}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="text-sm mt-2 flex justify-between">
        <span>{currentTime.toFixed(2)}s</span>
        <span>{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
}
