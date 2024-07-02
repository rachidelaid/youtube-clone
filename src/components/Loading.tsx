import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black/60 z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Loading;
