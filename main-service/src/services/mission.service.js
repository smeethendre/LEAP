import { Mission } from '../models/mission.model.js'
import { ApiError } from '../utils/apiError.js'

const getAllMissionsService = async () => {
  return await Mission.find().select('missionId missionName missionType status').sort({ createdAt: -1 })
}

const getMissionByIdService = async (id) => {
  const mission = await Mission.findById(id)
  if (!mission) throw new ApiError(404, 'Mission not found')
  return mission
}

export { getAllMissionsService, getMissionByIdService }