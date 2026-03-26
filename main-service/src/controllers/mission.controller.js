import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { getAllMissionsService, getMissionByIdService } from '../services/mission.service.js'

const getAllMissions = asyncHandler(async (req, res) => {
  const missions = await getAllMissionsService()
  res.status(200).json(new ApiResponse(200, missions, 'Missions fetched'))
})

const getMissionById = asyncHandler(async (req, res) => {
  const mission = await getMissionByIdService(req.params.id)
  res.status(200).json(new ApiResponse(200, mission, 'Mission fetched'))
})

export { getAllMissions, getMissionById }