import { TeamMembersController } from "@/controllers/team-members-controller";
import { Router } from "express";

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post("/", teamMembersController.create)

export { teamMembersRoutes }