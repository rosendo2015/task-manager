import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { TaskStatus } from "generated/prisma/enums"
import z from "zod"

class TasksController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(6, { message: "Título inválido, mínimo de 6 caracteres" }),
            description: z.string(),
            team_id: z.number(),
            assigned_to: z.number(),
            status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
            priority: z.enum(["high", "medium", "low"])
        })

        const { title, description, team_id, assigned_to, status, priority } = bodySchema.parse(request.body)

        // time existe?
        const team = await prisma.teams.findUnique({ where: { id: team_id } })
        if (!team) throw new AppError("Time não encontrado!", 404)

        // usuário existe?
        const user = await prisma.users.findUnique({ where: { id: assigned_to } })
        if (!user) throw new AppError("Usuário não encontrado!", 404)

        // usuário pertence ao time?
        const member = await prisma.team_members.findFirst({ where: { user_id: assigned_to, team_id } })
        if (!member) throw new AppError("Usuário não pertence a este time", 400)

        // usuário já tem tarefa ativa?
        const existingTask = await prisma.tasks.findFirst({
            where: { assigned_to, team_id, status: { in: ["pending", "in_progress"] } }
        })
        if (existingTask) throw new AppError("Usuário já possui tarefa ativa neste time", 400)

        const task = await prisma.tasks.create({
            data: { title, description, status, priority, assigned_to, team_id }
        })

        return response.status(201).json(task)
    }
    async index(request: Request, response: Response) {
        const querySchema = z.object({
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            priority: z.enum(["high", "medium", "low"]).optional()
        })

        const { status, priority } = querySchema.parse(request.query)

        const tasks = await prisma.tasks.findMany({
            where: {
                ...(status ? { status } : {}),
                ...(priority ? { priority } : {})
            }
        })

        return response.status(200).json(tasks)
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })

        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.tasks.findUnique({
            where: { id },
            include: { assignedUser: true, team: true }
        })

        if (!task) {
            throw new AppError("Tarefa não encontrada!", 404)
        }

        return response.status(200).json(task)
    }
    async assign(request: Request, response: Response) {
        // validação do parâmetro id da tarefa
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })
        const { id } = paramsSchema.parse(request.params)

        // validação do body (novo responsável)
        const bodySchema = z.object({
            assigned_to: z.number().positive()
        })
        const { assigned_to } = bodySchema.parse(request.body)

        // buscar tarefa
        const task = await prisma.tasks.findUnique({ where: { id } })
        if (!task) throw new AppError("Tarefa não encontrada!", 404)

        // verificar se o usuário existe
        const user = await prisma.users.findUnique({ where: { id: assigned_to } })
        if (!user) throw new AppError("Usuário não encontrado!", 404)

        // verificar se o usuário pertence ao time da tarefa
        const member = await prisma.team_members.findFirst({
            where: { user_id: assigned_to, team_id: task.team_id }
        })
        if (!member) throw new AppError("Usuário não pertence a este time", 400)

        // verificar se o usuário já tem tarefa ativa nesse time
        const existingTask = await prisma.tasks.findFirst({
            where: {
                assigned_to,
                team_id: task.team_id,
                status: { in: ["pending", "in_progress"] }
            }
        })
        if (existingTask) throw new AppError("Usuário já possui tarefa ativa neste time", 400)

        // atualizar atribuição
        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: { assigned_to }
        })

        // registrar histórico da reatribuição
        const changedBy = Number(request.user?.id)
        if (!changedBy) throw new AppError("Usuário autenticado inválido", 401)

        await prisma.tasks_history.create({
            data: {
                task_id: id,
                changed_by: changedBy,
                old_status: task.status,          // status anterior
                new_status: task.status as TaskStatus // status permanece, mas registra mudança de responsável
            }
        })

        return response.status(200).json(updatedTask)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.coerce.number().positive() })
        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            title: z.string().min(6).optional(),
            description: z.string().optional(),
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            priority: z.enum(["high", "medium", "low"]).optional()
        })

        const parsedData = bodySchema.parse(request.body)
        const data = Object.fromEntries(Object.entries(parsedData).filter(([_, v]) => v !== undefined))

        const existingTask = await prisma.tasks.findUnique({ where: { id } })
        if (!existingTask) throw new AppError("Tarefa não encontrada!", 404)

        // se status mudou, salvar histórico
        if (data.status && data.status !== existingTask.status) {
            const changedBy = Number(request.user?.id)
            if (!changedBy) throw new AppError("Usuário autenticado inválido", 401)

            await prisma.tasks_history.create({
                data: {
                    task_id: id,
                    changed_by: changedBy,
                    old_status: existingTask.status,
                    new_status: data.status as TaskStatus
                }
            })
        }

        const updatedTask = await prisma.tasks.update({ where: { id }, data })
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