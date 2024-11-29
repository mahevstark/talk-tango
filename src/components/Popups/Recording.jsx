import { useState, useEffect, useRef } from "react";
import { Mic, StopCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import audio from "../../../public/messages/Audio.svg";

export default function AudioRecordingPopup({ onRecordingComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [recordingState, setRecordingState] = useState("idle");
  const [time, setTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploading, setUploading] = useState(false);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const sendtoparent = (url) => {
    console.log("Sending URL to parent:", url);
    
    if (url) {
      onRecordingComplete(url);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setRecordingState("idle");
      setTime(0);
      setAudioUrl(null);
      setAudioBlob(null);
      audioChunksRef.current = [];

      const stream = mediaRecorderRef.current?.stream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      mediaRecorderRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (recordingState === "recording") {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [recordingState]);

  const handleStartRecording = async () => {
    try {
      setAudioUrl(null);
      setAudioBlob(null);
      audioChunksRef.current = [];
      setRecordingState("idle");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setRecordingState("stopped");
      };

      mediaRecorderRef.current.start();
      setRecordingState("recording");
      setTime(0);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    const stream = mediaRecorderRef.current?.stream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setRecordingState("stopped");
  };

  const handleSendRecording = async () => {
    console.log("Uploading audio...");

    if (!audioBlob) {
      console.error("No audio blob found");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      setUploading(false);
      return;
    }

    formData.append("token", token);

    try {
      const response = await fetch(
        "https://talktango.estamart.com/api/upload_audio",
        {
          method: "POST",

          body: formData,
        }
      );

      const responseJson = await response.json();
      console.log("my response", responseJson);

      if (responseJson.action === "success") {
        const finalUrl = responseJson.filename;
        setAudioUrl(finalUrl);
        sendtoparent(finalUrl);
        setIsOpen(false);
      } else {
        console.error("Upload failed", responseJson);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setUploading(false);
    }
  };

  const handlePlayRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <Image src={audio} alt="audio" loading="lazy" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {recordingState === "idle" && "Recording"}
              {recordingState === "recording" && "Recording"}
              {recordingState === "stopped" && "Send"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {recordingState === "idle" && (
              <>
                <Button onClick={handleStartRecording}>
                  <Mic className="h-12 w-12" />
                </Button>
                <p>Tap to start recording</p>
              </>
            )}

            {recordingState === "recording" && (
              <>
                <Button onClick={handleStopRecording}>
                  <StopCircle className="h-12 w-12" />
                </Button>
                <p>{formatTime(time)}</p>
                <p>Press to stop recording</p>
              </>
            )}

            {recordingState === "stopped" && (
              <>
                {audioUrl && (
                  <audio ref={audioRef} controls>
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <p>{formatTime(time)}</p>
                <Button onClick={handleSendRecording} disabled={uploading}>
                  <Send className="h-12 w-12" />
                  {uploading && <span>Uploading...</span>}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
