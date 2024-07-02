import RelatedSearchTerms from "@/components/RelatedSearchTerms";
import { useSearch } from "@/context/SearchContext";
import VideoCard from "@/components/VideoCard";
import PlaylistCard from "@/components/PlaylistCard";
import { useEffect, useState } from "react";
import { thumbnail } from "ytdl-core";
import { Playlist } from "ytsr";

const timeFormatted = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const seconds2 = Math.floor(seconds % 60);

  return [hours, minutes, seconds2]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};

const index = () => {
  const { data } = useSearch();
  const [related_videos, setRelatedVideos] = useState([]);

  useEffect(() => {
    const list = localStorage.getItem("last_related_videos");
    if (list) {
      setRelatedVideos(JSON.parse(list));
    }
  }, []);

  return (
    <div className="p-4">
      <RelatedSearchTerms />

      <div className="mt-8">
        {data?.correctedQuery !== data?.originalQuery && (
          <p className="text-xs mb-4 text-gray-50">
            do you mean{" "}
            <b className="cursor-pointer text-white underline">
              {data?.correctedQuery}
            </b>
          </p>
        )}
        {data?.items ? (
          <div className="flex flex-col gap-8">
            {data?.items
              .filter((v) => ["video", "playlist"].includes(v.type))
              .map((video, index) =>
                video.type === "video" ? (
                  <VideoCard key={index} {...video} />
                ) : (
                  <PlaylistCard key={index} {...(video as Playlist)} />
                )
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
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
    </div>
  );
};

export default index;
