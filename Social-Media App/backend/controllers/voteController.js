
// controllers/voteController.js
import Post from "../models/Post.js";
import Vote from "../models/Vote.js";

// Prevent double voting and count votes
export const voteOnPost = async (req, res) => {
  try {
    const { postId, tag } = req.body;

    // Check if the user already voted for this tag
    const alreadyVoted = await Vote.findOne({ user: req.user.id, tag });
    if (alreadyVoted) {
      return res
        .status(400)
        .json({ message: "You already voted for this tag!" });
    }

    // Increment vote count on post
    await Post.findByIdAndUpdate(postId, { $inc: { votes: 1 } });

    // Record the vote
    const newVote = new Vote({
      user: req.user.id,
      post: postId,
      tag,
    });
    await newVote.save();

    res.json({ message: "Vote registered!" });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Failed to register vote" });
  }
};

// Get 2-4 random posts for a given tag
export const getVotingPosts = async (req, res) => {
  const { tagName } = req.params;
  try {
    console.log(`Fetching voting posts for tag: ${tagName}`);
    const posts = await Post.aggregate([
      { $match: { tags: tagName } },
      { $sample: { size: 3 } }
    ]);
    res.json(posts);
  } catch (error) {
    console.error("Voting fetch error:", error);
    res.status(500).json({ message: "Failed to fetch voting posts" });
  }
};
