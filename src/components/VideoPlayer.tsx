import {
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import { videoFormat } from "ytdl-core";
import AutoPlay from "./AutoPlay";
import { useRouter } from "next/router";

interface Props {
  qualities?: videoFormat[];
  nextVideo?: string;
}

const speed = [
  { value: 0.25, label: "0.25" },
  { value: 0.5, label: "0.5" },
  { value: 0.75, label: "0.75" },
  { value: 1, label: "1" },
  { value: 1.25, label: "1.25" },
  { value: 1.5, label: "1.5" },
  { value: 1.75, label: "1.75" },
  { value: 2, label: "2" },
];

const getQuality = (array: videoFormat[] | undefined) => {
  // going by the smallest
  if (!array) return 144;

  return array
    .map((q) => +q?.qualityLabel?.split("p")[0])
    .filter((q) => q)
    .reduce((prev: number, curr: number) => {
      if (prev && curr) {
        return prev < curr ? prev : curr;
      } else {
        return prev || curr;
      }
    });
};

const timeFormatted = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds2 = Math.floor(seconds % 60);

  return [hours, minutes, seconds2]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

const TimeLine = ({
  buffer,
  currentTime,
  duration,
  onClick,
}: {
  buffer: number;
  duration: number;
  currentTime: number;
  onClick: MouseEventHandler<HTMLDivElement>;
}) => (
  <div
    className="h-1 bg-white/40 group relative rotate-180 cursor-pointer"
    onClick={onClick}
  >
    <div
      className="absolute top-0 left-0 h-full bg-white/60 transition-all delay-75"
      style={{ width: `${(buffer / duration) * 100}%` }}
    />
    <div
      className="absolute top-0 left-0 h-full bg-primary transition-all delay-75"
      style={{ width: `${(currentTime / duration) * 100}%` }}
    />
    {currentTime > 0 && (
      <div
        className="absolute top-0 bg-primary opacity-0 group-hover:opacity-100 group-hover:w-3 group-hover:h-3 rounded-full -translate-x-1/2 -translate-y-1/3 transition-all duration-300 ease-in-out w-0 h-0"
        style={{ left: `${(currentTime / duration) * 100}%` }}
      />
    )}
  </div>
);

const VideoPlayer = ({ qualities, nextVideo }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [playingTime, setPlayingTime] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(3);
  const [currentQuality, setCurrentQuality] = useState(getQuality(qualities));

  const router = useRouter();

  const qs = new Set(qualities?.map((q) => q.qualityLabel));

  const labels = qs
    ? [...qs]
        .filter((q) => q)
        .sort((a, b) => +b.split("p")[0] - +a.split("p")[0])
    : [];

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
      setPlaying(true);
    } else {
      videoRef.current?.pause();
      setPlaying(false);
    }
  };

  if (!qualities)
    return <div className="w-full aspect-video bg-gray-200 rounded"></div>;

  const contentLength = qualities[0].approxDurationMs || 0;

  const handlePlaying = () => {
    setPlayingTime((videoRef.current?.currentTime || 0) * 1000);
  };

  const handleSeeking = (e: any) => {
    e.stopPropagation();

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    if (playing) videoRef.current?.pause();
    if (videoRef.current)
      videoRef.current.currentTime = (percentage * +contentLength) / 1000;
    if (playing) videoRef.current?.play();
    setPlayingTime(percentage * +contentLength);
  };

  const handleVolumnChange = (e: {
    target: { value: string | SetStateAction<number> };
  }) => {
    setVolume(+e.target.value);
    if (videoRef.current) videoRef.current.volume = +e.target.value / 100;

    if (e.target.value === "0") {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else {
      videoRef.current?.parentNode?.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const handleQualityChange = (e: { target: { value: string | number } }) => {
    if (videoRef.current) {
      const newSrc = qualities.find((q) =>
        q.qualityLabel?.startsWith(`${e.target.value}`)
      )?.url;

      console.log(newSrc, videoRef.current.src);

      if (newSrc) {
        setCurrentQuality(+e.target.value);

        const currentTime = videoRef.current.currentTime;
        const isPlaying = !videoRef.current.paused;

        videoRef.current.src = newSrc;

        if (isPlaying) videoRef.current.play();
        videoRef.current.currentTime = currentTime;
      }
    }
  };

  const videoEnded = () => {
    if (nextVideo && autoPlayNext) {
      // setPlaying(false);
      // setPlayingTime(0);
      // setBuffer(0);
      // setIsWaiting(true);
      // setIsFullScreen(false);

      // router.push(`/video/${nextVideo}`);
      window.location.href = `/video/${nextVideo}`;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed[speedIndex].value;
    }
  }, [speedIndex]);

  return (
    <div className="relative group flex items-center">
      {isWaiting && (
        <div className="bg-black/50 inset-0 absolute z-50 flex justify-center items-center">
          <span className="video_loader"></span>
        </div>
      )}
      <video
        className="w-full mt-8 mx-auto rounded"
        ref={videoRef}
        onTimeUpdate={handlePlaying}
        onProgress={() => {
          try {
            const newBuffer = videoRef.current?.buffered?.end(0);
            setBuffer((newBuffer || 0) * 1000);
          } catch (error) {}
        }}
        onWaiting={() => setIsWaiting(true)}
        onPlaying={() => setIsWaiting(false)}
        onClick={togglePlay}
        muted={isMuted}
        onEnded={videoEnded}
      >
        <source
          src={
            qualities.find((q) =>
              q.qualityLabel?.startsWith(`${currentQuality}`)
            )?.url
          }
        />
      </video>

      <div className="absolute transition-all opacity-0 group-hover:opacity-100 flex flex-col-reverse bottom-0 left-0 z-20 bg-gradient-b-t h-0 group-hover:h-14 w-full rotate-180 bg-videoTimeLine">
        <TimeLine
          buffer={buffer}
          duration={+contentLength}
          currentTime={playingTime}
          onClick={handleSeeking}
        />
        <div className="flex items-center gap-4 p-2 h-full rotate-180">
          <div onClick={togglePlay}>
            {!playing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 cursor-pointer"
                fill="currentColor"
              >
                <title>play</title>
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 cursor-pointer"
                fill="currentColor"
              >
                <title>pause</title>
                <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
              </svg>
            )}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 cursor-pointer"
            fill="currentColor"
          >
            <title>skip-next</title>
            <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
          </svg>

          <div className="flex items-center gap-1 w-6 transition-all delay-200 ease-in-out hover:w-24 overflow-hidden">
            <div onClick={() => setIsMuted(!isMuted)}>
              {!isMuted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 cursor-pointer"
                  fill="currentColor"
                >
                  <title>volume-high</title>
                  <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 cursor-pointer"
                  fill="currentColor"
                >
                  <title>volume-off</title>
                  <path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
                </svg>
              )}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={handleVolumnChange}
              className="volume-slider"
            />
          </div>

          <p className="text-xs">
            {timeFormatted(playingTime)} / {timeFormatted(+contentLength)}
          </p>

          <div className="ml-auto flex gap-3 items-center">
            <select
              onChange={handleQualityChange}
              value={currentQuality}
              className="bg-gray-50/50 rounded-lg text-xs px-2 py-1 cursor-pointer"
            >
              {labels.map((quality) => (
                <option key={quality} value={quality.split("p")[0]}>
                  {quality}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 cursor-pointer"
              fill="currentColor"
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 30;
              }}
            >
              <title>rewind-30</title>
              <path d="M19,14V20C19,21.11 18.11,22 17,22H15A2,2 0 0,1 13,20V14A2,2 0 0,1 15,12H17C18.11,12 19,12.9 19,14M15,14V20H17V14H15M11,20C11,21.11 10.1,22 9,22H5V20H9V18H7V16H9V14H5V12H9A2,2 0 0,1 11,14V15.5A1.5,1.5 0 0,1 9.5,17A1.5,1.5 0 0,1 11,18.5V20M12.5,3C17.15,3 21.08,6.03 22.47,10.22L20.1,11C19.05,7.81 16.04,5.5 12.5,5.5C10.54,5.5 8.77,6.22 7.38,7.38L10,10H3V3L5.6,5.6C7.45,4 9.85,3 12.5,3Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 cursor-pointer"
              fill="currentColor"
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime += 30;
              }}
            >
              <title>fast-forward-30</title>
              <path d="M11.5,3C6.85,3 2.92,6.03 1.53,10.22L3.9,11C4.95,7.81 7.96,5.5 11.5,5.5C13.46,5.5 15.23,6.22 16.62,7.38L14,10H21V3L18.4,5.6C16.55,4 14.15,3 11.5,3M19,14V20C19,21.11 18.11,22 17,22H15A2,2 0 0,1 13,20V14A2,2 0 0,1 15,12H17C18.11,12 19,12.9 19,14M15,14V20H17V14H15M11,20C11,21.11 10.1,22 9,22H5V20H9V18H7V16H9V14H5V12H9A2,2 0 0,1 11,14V15.5A1.5,1.5 0 0,1 9.5,17A1.5,1.5 0 0,1 11,18.5V20Z" />
            </svg>
            <p
              className="text-xs cursor-pointer w-11 font-bold text-center select-none"
              onClick={() => setSpeedIndex((speedIndex + 1) % speed.length)}
            >
              X {speed[speedIndex].label}
            </p>
            <AutoPlay autoPlay={autoPlayNext} setAutoPlay={setAutoPlayNext} />
            <div onClick={toggleFullscreen}>
              {isFullScreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-7 cursor-pointer"
                  fill="currentColor"
                >
                  <title>fullscreen-exit</title>
                  <path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-7 cursor-pointer"
                  fill="currentColor"
                >
                  <title>fullscreen</title>
                  <path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
