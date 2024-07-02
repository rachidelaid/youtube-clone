import type { NextApiRequest, NextApiResponse } from "next";
import ytdl, { videoFormat, MoreVideoDetails, relatedVideo } from "ytdl-core";

export interface VideoFormat extends videoFormat {
  details?: MoreVideoDetails;
  related_videos?: relatedVideo[];
  qualities?: videoFormat[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method Not Allowed",
    });
    return;
  }

  try {
    const id = req.body.id || JSON.parse(req.body).id.trim();
    const info = await ytdl.getInfo("https://www.youtube.com/watch?v=" + id);

    const qualities = info.formats.filter((v) => v.container === "mp4");

    res.json({
      qualities,
      details: info.videoDetails,
      related_videos: info.related_videos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
