import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import {
  createTeamMemberService,
  getAllTeamMembersService,
  getTeamMemberByIdService,
  updateTeamMemberService,
  deleteTeamMemberService,
} from '../services/team.service.js'

// POST /api/team
const createTeamMember = asyncHandler(async (req, res) => {
  const member = await createTeamMemberService(req.body)
  res.status(201).json(new ApiResponse(201, member, 'Team member added'))
})

// GET /api/team
const getAllTeamMembers = asyncHandler(async (req, res) => {
  const members = await getAllTeamMembersService()
  res.status(200).json(new ApiResponse(200, members, 'Team fetched'))
})

// GET /api/team/:id
const getTeamMemberById = asyncHandler(async (req, res) => {
  const member = await getTeamMemberByIdService(req.params.id)
  res.status(200).json(new ApiResponse(200, member, 'Team member fetched'))
})

// PATCH /api/team/:id
const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await updateTeamMemberService(req.params.id, req.body)
  res.status(200).json(new ApiResponse(200, member, 'Team member updated'))
})

// DELETE /api/team/:id
const deleteTeamMember = asyncHandler(async (req, res) => {
  await deleteTeamMemberService(req.params.id)
  res.status(200).json(new ApiResponse(200, null, 'Team member removed'))
})

export {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
}