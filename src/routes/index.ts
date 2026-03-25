import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamsRoutes } from "./teams-routes";
import { ensureAuthenticated } from "@/middleware/ensure-authenticated";
import { teamMembersRoutes } from "./team-members-routes";

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)

routes.use(ensureAuthenticated)
routes.use("/tasks", tasksRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/teamMembers", teamMembersRoutes)

export { routes }