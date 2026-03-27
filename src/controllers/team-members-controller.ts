import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { z } from "zod"

class TeamMembersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            userId: z.number().positive({ message: "Usuário inválido" }),
            teamId: z.number().positive({ message: "Usuário inválido" })
        })
        const { userId, teamId } = bodySchema.parse(request.body)
        const user = await prisma.users.findUnique({ where: { id: userId } })
        if (!user) {
            throw new AppError("Usuário não encontrado!", 401)
        }
        const team = await prisma.teams.findUnique({ where: { id: teamId } })
        if (!team) {
            throw new AppError("Time não encontrado!", 401)
        }
        const teamMember = await prisma.team_members.create({
            data: {
                user_id: userId,
                team_id: teamId
            }
        })

        return response.status(201).json(teamMember)

    }
    async index(request: Request, response: Response) {
        const teamMembers = await prisma.team_members.findMany()
        return response.status(200).json(teamMembers)
    }
}
export { TeamMembersController }