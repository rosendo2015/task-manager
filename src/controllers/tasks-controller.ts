import { Request, Response } from "express"
import z from "zod"

class TasksController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(6, { message: "Descrição inválida, minimo de 6 caracteres" }),
            description: z.string(),
            team_id: z.number(),
            assigned_to: z.number(),
            status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
            priority: z.enum(["high", "medium", "low"])
        })
        const { title, description, team_id, assigned_to, status, priority } = bodySchema.parse(request.body)
        return response.json({ title, description, team_id, assigned_to, status, priority })
    }
    async index(request: Request, response: Response) {
        return response.json({ message: "List" })
    }
}
export { TasksController }