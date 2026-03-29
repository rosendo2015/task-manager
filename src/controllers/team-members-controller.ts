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

        const alreadyInTeam = await prisma.team_members.findFirst({
            where: { user_id: userId }
        })
        if (alreadyInTeam) {
            throw new AppError("Usuário já pertence a um time", 400)
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
    async deleteMember(request: Request, response: Response) {
        // validação dos params
        const paramsSchema = z.object({
            teamId: z.coerce.number().positive(),
            userId: z.coerce.number().positive()
        })
        const { teamId, userId } = paramsSchema.parse(request.params)

        // verificar se o membro existe nesse time
        const member = await prisma.team_members.findFirst({
            where: { team_id: teamId, user_id: userId }
        })

        if (!member) {
            throw new AppError("Esse usuário não pertence a este time", 404)
        }
        // checar se o usuário tem tarefas pendentes nesse time
        const notCompletedTasks = await prisma.tasks.count({
            where: {
                team_id: teamId,
                assigned_to: userId,
                status: { in: ["pending", "in_progress"] } // ou o valor que você usa para tarefas abertas
            }
        })

        if (notCompletedTasks > 0) {
            throw new AppError("Não é possível remover: o usuário ainda possui tarefas pendentes", 400)
        }

        // excluir o vínculo
        await prisma.team_members.delete({
            where: { id: member.id }
        })

        return response.status(200).json({ message: "Membro removido com sucesso" })
    }
    async listByTeam(request: Request, response: Response) {
        const paramsSchema = z.object({
            teamId: z.coerce.number().positive()
        })
        const { teamId } = paramsSchema.parse(request.params)

        const members = await prisma.team_members.findMany({
            where: { team_id: teamId },
            include: { user: true } // opcional: trazer dados do usuário
        })

        return response.status(200).json(members)
    }

}
export { TeamMembersController }