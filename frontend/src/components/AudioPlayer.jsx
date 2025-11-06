import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const MAX = 180; // 3 minutes cap display

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDur(a.duration || 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  // prevent scrubbing beyond actual duration (UI)
  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setTime(val);
  };

  return (
    <div className="w-full">
      <audio ref={audioRef} src={src} controls className="w-full rounded-xl" preload="metadata" />
      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={Math.min(dur || MAX, MAX)}
          step={1}
          value={Math.min(time, MAX)}
          onChange={handleSeek}
          className="w-full"
        />
        <div className="w-24 text-right text-xs text-gray-600">
          {fmt(time)} / {fmt(Math.min(dur || MAX, MAX))}
        </div>
      </div>
      {dur > MAX && (
        <p className="text-xs text-red-600 mt-1">Note: Episode exceeds 3 minutes; playback limited to display range.</p>
      )}
      {title && <p className="text-xs text-gray-500 mt-1">{title}</p>}
    </div>
  );
}
