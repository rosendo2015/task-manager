import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
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
        const team = await prisma.teams.findUnique({ where: { id: team_id } })
        if (!team) {
            throw new AppError("Time não encontrado!")
        }
        const assigned = await prisma.users.findUnique({ where: { id: assigned_to } })
        if (!assigned) {
            throw new AppError("Usuário não encontrado!")
        }
        const existingTask = await prisma.tasks.findFirst({
            where: {
                title,
                assigned_to,
                team_id,
                status: { not: "completed" }
            }
        })
        if (existingTask) {
            throw new AppError("Este usuário já possui uma tarefa ativa neste time", 400);
        }
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                status,
                priority,
                assigned_to,
                team_id
            }
        })


        return response.json({ title, description, team_id, assigned_to, status, priority })
    }
    async index(request: Request, response: Response) {
        const tasks = await prisma.tasks.findMany()
        return response.json(tasks)
    }
    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.number()
        })
        const { id } = paramsSchema.parse(request.params)
        const task = await prisma.tasks.findFirst({
            where: { id }
        })
        return response.status(201).json(task)
    }
}
export { TasksController }