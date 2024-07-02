import Image from "next/image";
import { Playlist } from "ytsr";
import Link from "next/link";

interface Channel {
  name: string;
  verified: boolean;
}

const Channel = ({ name, verified }: Channel) => (
  <div className="flex items-center gap-2">
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

const PlaylistCard = (props: Playlist) => {
  const { title, playlistID, firstVideo, owner, length } = props;

  return (
    <Link href={`/playlist/${playlistID}`}>
      <div className="flex gap-4 items-center">
        <div className="flex-shrink-0 relative w-80 aspect-video">
          {firstVideo?.bestThumbnail?.url && (
            <Image
              src={firstVideo?.bestThumbnail.url}
              alt={title}
              className="rounded-md"
              layout="fill"
            />
          )}
          <div className="flex justify-between items-center py-1 px-2 absolute bottom-0 left-0 bg-black/80 w-full">
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              fill="white"
            >
              <path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z"></path>
            </svg>

            <p className="text-xs text-gray-50">{length}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">{title}</p>
          {owner && <Channel name={owner.name} verified={owner.verified} />}

          {firstVideo && (
            <p className="text-xs text-gray-50">
              {firstVideo.title} . {firstVideo.length}
            </p>
          )}
          <p className="text-sm text-gray-50 font-bold hover:text-gray-100 transition-all delay-100 mt-1">
            View full playlist
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
