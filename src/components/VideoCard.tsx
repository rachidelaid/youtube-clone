import Image from "next/image";
import { Video } from "ytsr";
import { thumbnail } from "ytdl-core";
import Link from "next/link";

interface Channel {
  name: string;
  verified: boolean;
  thumbnail: {
    url: string | null;
    width: number;
    height: number;
  };
}

const Channel = ({ name, verified, thumbnail }: Channel) => (
  <div className="flex items-center gap-2">
    <div className="relative w-6 h-6 rounded-full">
      {thumbnail.url && (
        <Image
          src={thumbnail.url}
          alt={name}
          className="rounded-full"
          layout="fill"
        />
      )}
    </div>

    <p className="text-xs text-gray-500">{name}</p>

    {verified && (
      <svg
        height="12"
        viewBox="0 0 24 24"
        width="12"
        focusable="false"
        fill="currentColor"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path>
      </svg>
    )}
  </div>
);

interface Props extends Video {
  view?: "search" | "home";
  richThumbnails?: thumbnail;
}

const VideoCard = (props: Props) => {
  const {
    title,
    bestThumbnail,
    views,
    duration,
    description,
    author,
    uploadedAt,
    id,
    view = "search",
    richThumbnails,
  } = props;
  const viewsFormatted = (num: number | null) => {
    if (num === null) return "0";

    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

  return (
    <Link href={`/video/${id}`} className="group">
      <div
        className={`flex gap-4 ${
          view === "home" ? "flex-col" : "items-center"
        }`}
      >
        <div
          className={`flex-shrink-0 relative aspect-video shadow-gray-200 shadow-none group-hover:shadow-2xl overflow-hidden rounded-md ${
            view === "home" ? "w-full" : "w-80"
          }`}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity delay-150 absolute inset-0 z-10">
            {richThumbnails?.url && (
              <Image src={richThumbnails.url} alt={title} layout="fill" />
            )}
          </div>

          {bestThumbnail?.url && (
            <Image
              src={bestThumbnail.url}
              alt={title}
              className="rounded-md"
              layout="fill"
            />
          )}
          <div className="absolute bottom-1 right-1 bg-gray-300 text-gray-50 px-1 text-xs">
            {duration}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-500">
            {viewsFormatted(views)} Views . {uploadedAt}
          </p>
          {author?.bestAvatar && (
            <Channel
              name={author.name}
              verified={author.verified}
              thumbnail={{
                url: author.bestAvatar.url,
                width: author.bestAvatar.width,
                height: author.bestAvatar.height,
              }}
            />
          )}

          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
