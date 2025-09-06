// controllers/tagController.js
import Post from "../models/Post.js";

export const getTrendingTags = async (req, res) => {
  try {
    const trending = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
