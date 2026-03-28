import { TeamMembersController } from "@/controllers/team-members-controller";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";
import { Router } from "express";

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post("/", teamMembersController.create)
teamMembersRoutes.get("/", teamMembersController.index)

export { teamMembersRoutes }