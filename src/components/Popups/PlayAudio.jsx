import React, { useRef, useState, useEffect } from "react";
import { IoPlayCircle, IoPauseCircle } from "react-icons/io5";

export default function CustomAudioPlayer({ audioUri }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Ensure duration is updated when the metadata is loaded
  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio.duration); // Set the duration once the metadata is loaded
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime); // Update current time as audio plays

    if (audio.ended) {
      setIsPlaying(false);
      setCurrentTime(audio.duration); // Ensure playhead goes to the end of the slider
    }
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    audioRef.current.currentTime = newTime; // Set the audio time to the slider position
    setCurrentTime(newTime); // Update the current time state
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata); // Ensure duration is set once metadata is loaded
      audio.addEventListener("timeupdate", handleTimeUpdate); // Listen for time updates during playback
    }

    return () => {
      if (audio) {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white p-2 rounded-lg max-w-md mx-auto shadow-md">
      <audio ref={audioRef} preload="auto" onTimeUpdate={handleTimeUpdate}>
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
            max={duration || 0} // Dynamically set max to duration of audio
            value={currentTime}
            onChange={handleSeek} // Update currentTime on user interaction
            className="w-full h-1 bg-gray-600 appearance-none"
            style={{
              WebkitAppearance: "none",
            }}
          />
          {/* Circle Indicator */}
         
        </div>
      </div>

      {/* Time Display */}
      <div className="text-sm mt-2 text-end">
        <span>{isNaN(currentTime) ? "0.00" : currentTime.toFixed(2)}s</span>
      </div>
    </div>
  );
}
