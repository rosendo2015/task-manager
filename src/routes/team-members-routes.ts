import { TeamMembersController } from "@/controllers/team-members-controller";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";
import { Router } from "express";

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post("/", verifyUserAuthorization(["admin"]), teamMembersController.create)
teamMembersRoutes.get("/", verifyUserAuthorization(["admin"]), teamMembersController.index)
teamMembersRoutes.get("/:teamId", verifyUserAuthorization(["admin"]), teamMembersController.listByTeam)
teamMembersRoutes.delete("/teams/:teamId/members/:userId", verifyUserAuthorization(["admin"]), teamMembersController.deleteMember)


export { teamMembersRoutes }