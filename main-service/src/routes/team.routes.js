import { Router } from 'express'
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/team.controller.js'

const router = Router()

router.post('/',     createTeamMember)
router.get('/',      getAllTeamMembers)
router.get('/:id',   getTeamMemberById)
router.patch('/:id', updateTeamMember)
router.delete('/:id',deleteTeamMember)

export { router as teamRouter }