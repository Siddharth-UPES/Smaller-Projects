// controllers/postController.js
import Post from "../models/Post.js";

// Upload a new post
export const uploadPost = async (req, res) => {
  try {
    const { caption, tags } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image upload required" });
    }
    const newPost = new Post({
      imageUrl: `/uploads/${req.file.filename}`,
      caption,
      tags: tags.split(", ").map((tag) => tag.trim()),
      uploader: req.user.id,
    });
    await newPost.save();
    res.status(201).json({ message: "Post uploaded!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed on server" });
  }
};

// Get all feed posts sorted by creation date (latest first)
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posts matching a specific tag
export const getPostsByTag = async (req, res) => {
  try {
    const posts = await Post.find({ tags: req.params.tagName });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });
    if (post.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already liked this post." });
    }
    post.likes += 1;
    post.likedBy.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to like post." });
  }
};

// Unlike a post (toggle functionality)
export const unlikePost = async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });
    if (!post.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You haven't liked this post yet." });
    }
    post.likes -= 1;
    // Remove the user ID from the likedBy array
    post.likedBy = post.likedBy.filter(
      (id) => id.toString() !== userId
    );
    await post.save();
    res.status(200).json({ message: "Post unliked!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unlike post." });
  }
};

// Delete a post - only the uploader can delete their post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post not found" });
    if (post.uploader.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this post." });
    }
    await post.remove();
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
