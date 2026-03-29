import { TasksController } from "@/controllers/tasks-controller";
import { verifyUserAuthorization } from "@/middleware/verify-user-authorization";

import { Router } from "express";

const tasksController = new TasksController()
const tasksRoutes = Router()



tasksRoutes.post("/", verifyUserAuthorization(["admin"]), tasksController.create)
tasksRoutes.get("/", tasksController.index)
tasksRoutes.get("/:id", tasksController.show)
tasksRoutes.patch("/:id", verifyUserAuthorization(["admin"]), tasksController.update)
// reatribuir tarefa (assign)
tasksRoutes.patch("/:id/assign", verifyUserAuthorization(["admin"]), tasksController.assign)
tasksRoutes.delete("/:id", verifyUserAuthorization(["admin"]), tasksController.delete)

export { tasksRoutes }