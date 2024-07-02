import { useState } from "react";

const Description = ({ description }: { description: string }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="mt-4 pl-4 text-gray-50 font-light transition-all delay-200">
      <div
        className={`transition-all delay-200 overflow-hidden flex flex-col gap-1 ${
          showMore ? "h-fit" : "h-20"
        }`}
      >
        {description.split("\n").map((line: string, i: number) => (
          <p key={`line_${i}`}>{line}</p>
        ))}
      </div>

      <p
        className="font-bold mt-4 cursor-pointer"
        onClick={() => setShowMore(!showMore)}
        role="button"
      >
        {showMore ? "Show less" : "Show more"}
      </p>
    </div>
  );
};

export default Description;
