import { Team } from '../models/team.model.js'
import { ApiError } from '../utils/apiError.js'

const createTeamMemberService = async (data) => {
  const { name, designation } = data

  if (!name || !designation) {
    throw new ApiError(400, 'Name and designation are required')
  }

  const alreadyExists = await Team.findOne({ name })
  if (alreadyExists) {
    throw new ApiError(409, 'Team member already exists')
  }

  const member = await Team.create(data)
  return member
}

const getAllTeamMembersService = async () => {
  return await Team.find({ isActive: true }).sort({ createdAt: 1 })
}

const getTeamMemberByIdService = async (id) => {
  const member = await Team.findById(id)
  if (!member) throw new ApiError(404, 'Team member not found')
  return member
}

const updateTeamMemberService = async (id, data) => {
  const member = await Team.findByIdAndUpdate(id, data, { new: true })
  if (!member) throw new ApiError(404, 'Team member not found')
  return member
}

const deleteTeamMemberService = async (id) => {
  const member = await Team.findByIdAndDelete(id)
  if (!member) throw new ApiError(404, 'Team member not found')
}

export {
  createTeamMemberService,
  getAllTeamMembersService,
  getTeamMemberByIdService,
  updateTeamMemberService,
  deleteTeamMemberService,
}