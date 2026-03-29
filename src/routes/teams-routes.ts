import { TeamsController } from "@/controllers/teams-controller";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";
import { Router } from "express";

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/", verifyUserAuthorization(["admin"]), teamsController.create)
teamsRoutes.get("/", verifyUserAuthorization(["admin"]), teamsController.index)
teamsRoutes.patch("/:id", verifyUserAuthorization(["admin"]), teamsController.update)
teamsRoutes.delete("/:id", verifyUserAuthorization(["admin"]), teamsController.delete)

export { teamsRoutes }