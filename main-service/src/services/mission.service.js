import { Mission } from '../models/mission.model.js'
import { ApiError } from '../utils/apiError.js'

const createMissionService = async (data) => {
  const { missionId, missionName, missionType } = data

  if (!missionId || !missionName || !missionType) {
    throw new ApiError(400, 'missionId, missionName and missionType are required')
  }

  const alreadyExists = await Mission.findOne({ missionId })
  if (alreadyExists) {
    throw new ApiError(409, `Mission ${missionId} already exists`)
  }

  const mission = await Mission.create(data)
  return mission
}

const getAllMissionsService = async () => {
  return await Mission.find({ isPublished: true })
    .populate('teamMembers', 'name designation')
    .sort({ createdAt: -1 })
}

const getMissionByIdService = async (id) => {
  const mission = await Mission.findById(id)
    .populate('teamMembers', 'name designation photo')
  if (!mission) throw new ApiError(404, 'Mission not found')
  return mission
}

const getMissionByMissionIdService = async (missionId) => {
  const mission = await Mission.findOne({ missionId })
    .populate('teamMembers', 'name designation photo')
  if (!mission) throw new ApiError(404, `Mission ${missionId} not found`)
  return mission
}

const updateMissionService = async (id, data) => {
  const mission = await Mission.findByIdAndUpdate(id, data, { new: true })
  if (!mission) throw new ApiError(404, 'Mission not found')
  return mission
}

const updateMissionStatusService = async (id, status) => {
  const allowed = ['upcoming', 'active', 'completed', 'failed']
  if (!allowed.includes(status)) {
    throw new ApiError(400, `Invalid status — must be one of: ${allowed.join(', ')}`)
  }

  const mission = await Mission.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
  if (!mission) throw new ApiError(404, 'Mission not found')
  return mission
}

const deleteMissionService = async (id) => {
  const mission = await Mission.findByIdAndDelete(id)
  if (!mission) throw new ApiError(404, 'Mission not found')
}

export {
  createMissionService,
  getAllMissionsService,
  getMissionByIdService,
  getMissionByMissionIdService,
  updateMissionService,
  updateMissionStatusService,
  deleteMissionService,
}