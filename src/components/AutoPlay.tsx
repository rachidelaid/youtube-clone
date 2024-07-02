import { useState } from "react";

const AutoPlay = ({
  autoPlay,
  setAutoPlay,
}: {
  autoPlay: boolean;
  setAutoPlay: (value: boolean) => void;
}) => {
  return (
    <div
      className="flex bg-gray-50/50 w-10 h-3 rounded-full cursor-pointer relative items-center"
      onClick={() => setAutoPlay(!autoPlay)}
    >
      <div
        className={`p-0.5 rounded-full bg-gray-100 absolute transition-all delay-150 ${
          autoPlay
            ? "right-0 bg-gray-50 text-gray-200"
            : "left-0 bg-gray-100 text-gray-50"
        }`}
      >
        {!autoPlay ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-3.5 cursor-pointer"
            fill="currentColor"
          >
            <title>pause</title>
            <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-3.5 cursor-pointer"
            fill="currentColor"
          >
            <title>play</title>
            <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
          </svg>
        )}
      </div>
    </div>
  );
};

export default AutoPlay;
