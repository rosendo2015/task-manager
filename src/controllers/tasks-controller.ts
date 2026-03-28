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


        return response.status(200).json({ title, description, team_id, assigned_to, status, priority })
    }
    async index(request: Request, response: Response) {
        const tasks = await prisma.tasks.findMany()
        return response.status(200).json(tasks)
    }
    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })

        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.tasks.findUnique({
            where: { id }
        })

        if (!task) {
            throw new AppError("Tarefa não encontrada!", 404)
        }

        return response.status(200).json(task)
    }
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })
        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            title: z.string().min(6).optional(),
            description: z.string().optional(),
            team_id: z.number().optional(),
            assigned_to: z.number().optional(),
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            priority: z.enum(["high", "medium", "low"]).optional()
        })

        const parsedData = bodySchema.parse(request.body)

        // Remove campos undefined para evitar conflito com exactOptionalPropertyTypes
        const data = Object.fromEntries(
            Object.entries(parsedData).filter(([_, value]) => value !== undefined)
        )

        const existingTask = await prisma.tasks.findUnique({ where: { id } })
        if (!existingTask) {
            throw new AppError("Tarefa não encontrada!", 400)
        }

        const updatedTask = await prisma.tasks.update({
            where: { id },
            data
        })

        return response.status(200).json(updatedTask)
    }
    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })

        const { id } = paramsSchema.parse(request.params)

        const taskDeleted = await prisma.tasks.findFirst({ where: { id } })
        if (!taskDeleted) {
            throw new AppError("Tarefa não encontrada.", 400)
        }

        await prisma.tasks.delete({
            where: { id }
        })

        return response.status(204).send()
    }

}
export { TasksController }