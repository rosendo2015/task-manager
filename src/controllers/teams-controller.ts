import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { request } from "node:http"
import { z } from "zod"

class TeamsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(6, { message: "Nome do time com no mínimo 6 caracteres." }),
            description: z.string().min(6)
        })
        const { name, description } = bodySchema.parse(request.body)
        const team = await prisma.teams.create({
            data: {
                name, description
            }
        })
        return response.status(201).json(team)
    }

    async index(request: Request, response: Response) {
        const teams = await prisma.teams.findMany()
        return response.status(200).json(teams)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })
        const { id } = paramsSchema.parse(request.params)

        const teamResults = await prisma.teams.findFirst({ where: { id } })
        if (!teamResults) {
            throw new AppError("Team não encontrado", 400)
        }

        const bodySchema = z.object({
            name: z.string().min(6),
            description: z.string().min(6, "A descrição deve conter pelo menos 6 caracteres."),
        })
        const parsedData = bodySchema.parse(request.body)

        const data = Object.fromEntries(
            Object.entries(parsedData).filter(([_, value]) => value !== undefined)
        )

        const team = await prisma.teams.update({
            where: { id },
            data
        })

        return response.status(200).json()
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.coerce.number().positive()
        })
        const { id } = paramsSchema.parse(request.params)
        const team = await prisma.teams.findFirst({ where: { id } })
        if (!team) {
            throw new AppError("Time não encontrado", 400)
        }
        // Verifica se existem membros vinculados
        const membersCount = await prisma.team_members.count({
            where: { id }
        })

        if (membersCount > 0) {
            return response.status(400).json({
                message: "Não é possível excluir: o time ainda possui membros vinculados."
            })
        }


        const teamDeleted = await prisma.teams.delete({ where: { id } })

        return response.status(200).json({ message: "Time deleted", teamDeleted })
    }

}
export { TeamsController }