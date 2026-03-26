import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
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
        return response.json({ message: "list team success" })
    }
}
export { TeamsController }