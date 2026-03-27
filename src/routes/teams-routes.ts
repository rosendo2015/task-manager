import { TeamsController } from "@/controllers/teams-controller";
import { Router } from "express";

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/", teamsController.create)
teamsRoutes.get("/", teamsController.index)

export { teamsRoutes }