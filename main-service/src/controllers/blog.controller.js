import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
} from '../services/blog.service.js'

// POST /api/blog
const createBlog = asyncHandler(async (req, res) => {
  const blog = await createBlogService(req.body)
  res.status(201).json(new ApiResponse(201, blog, 'Blog created'))
})

// GET /api/blog
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await getAllBlogsService()
  res.status(200).json(new ApiResponse(200, blogs, 'Blogs fetched'))
})

// GET /api/blog/:id
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await getBlogByIdService(req.params.id)
  res.status(200).json(new ApiResponse(200, blog, 'Blog fetched'))
})

// PATCH /api/blog/:id
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await updateBlogService(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, blog, 'Blog updated'))
})

// DELETE /api/blog/:id
const deleteBlog = asyncHandler(async (req, res) => {
  await deleteBlogService(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Blog deleted'))
})

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog }