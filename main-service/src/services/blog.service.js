import { BlogPost } from "../models/blogPost.model.js";
import { ApiError } from "../utils/apiError.js";

const createBlogService = async (data) => {
  const { blogTitle, blogDescription, blogContent } = data;

  if (!blogTitle || !blogDescription || !blogContent) {
    throw new ApiError(400, "Title, description and content are required");
  }

  const blog = await BlogPost.create(data);
  return blog;
};

const getAllBlogsService = async () => {
  return await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
};

const getBlogByIdService = async (id) => {
  const blog = await BlogPost.findById(id);
  if (!blog) throw new ApiError(404, "Blog not found");
  return blog;
};

const updateBlogService = async (id, data) => {
  const blog = await BlogPost.findByIdAndUpdate(id, data, { new: true });
  if (!blog) throw new ApiError(404, "Blog not found");
  return blog;
};

const deleteBlogService = async (id) => {
  const blog = await BlogPost.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, "Blog not found");
};

export {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
};
