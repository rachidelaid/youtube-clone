import { thumbnail } from "ytdl-core";
import { VideoFormat } from "../api/video";
import Description from "@/components/Description";
import VideoCard from "@/components/VideoCard";
import Image from "next/image";
import { useEffect } from "react";
import VideoPlayer from "@/components/VideoPlayer";

const timeFormatted = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds2 = Math.floor(seconds % 60);

  return [hours, minutes, seconds2]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

export async function getServerSideProps({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const resp = await fetch("http://localhost:3001/api/video", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
  const data: VideoFormat = await resp.json();

  return {
    props: data,
  };
}

const Video = (props: VideoFormat) => {
  const { qualities, details, related_videos } = props;

  useEffect(() => {
    localStorage.setItem("last_related_videos", JSON.stringify(related_videos));
  }, []);

  const getThumbnail = (thumbnails: any) => {
    return thumbnails.pop();
  };

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
    <div className="flex flex-col gap-4 px-4">
      <VideoPlayer
        qualities={qualities?.filter((q) => q.audioBitrate)}
        nextVideo={related_videos?.[0].id}
      />

      {details && (
        <div className="flex flex-col gap-4 px-4">
          <h2 className="text-xl font-bold">{details.title}</h2>

          <div className="flex gap-2 items-center">
            {details.author.thumbnails && (
              <div className="relative w-10 h-10 rounded-full mr-2">
                <Image
                  src={getThumbnail(details.author.thumbnails)?.url}
                  alt={details.author.name}
                  className="rounded-full"
                  layout="fill"
                />
              </div>
            )}
            <p>{details.author.name}</p>
            {details.author.verified && (
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

          <div className="rounded-lg bg-gray-200 p-4 text-sm mt-4">
            <div className="flex gap-8">
              <p className="font-bold">
                {viewsFormatted(+details.viewCount)} views
              </p>
              <p className="font-bold">{details.publishDate}</p>
            </div>

            {details.description && (
              <Description description={details.description} />
            )}
          </div>

          {related_videos && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              {related_videos.map((video: any) => (
                <VideoCard
                  key={video.id}
                  view="home"
                  title={video.title}
                  id={video.id}
                  url={video.id}
                  bestThumbnail={
                    video.thumbnails.sort(
                      (a: thumbnail, b: thumbnail) => b.width - a.width
                    )[0]
                  }
                  isUpcoming={false}
                  upcoming={null}
                  isLive={video.isLive}
                  badges={[]}
                  author={video.author}
                  description={null}
                  views={video.view_count}
                  duration={timeFormatted(video.length_seconds)}
                  richThumbnails={video.richThumbnails?.[0]}
                  uploadedAt={video.published}
                  type={"video"}
                  thumbnails={[]}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Video;
