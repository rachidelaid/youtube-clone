import type { NextApiRequest, NextApiResponse } from "next";
import ytsr from "ytsr";

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
    const query = req.body.query
      ? req.body.query.trim()
      : JSON.parse(req.body).query.trim();

    if (!query) {
      res.status(400).json({
        error: "Bad Request",
      });
      return;
    }

    const searchResults = await ytsr(query);

    res.json(searchResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
