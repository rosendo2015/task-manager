import { TasksController } from "@/controllers/tasks-controller";

import { Router } from "express";

const tasksController = new TasksController()
const tasksRoutes = Router()


tasksRoutes.post("/", tasksController.create)
tasksRoutes.get("/", tasksController.index)

export { tasksRoutes }