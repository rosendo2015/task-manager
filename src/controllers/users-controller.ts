import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { hash } from "bcrypt"
import { z } from "zod"

class UsersController {
    async index(request: Request, response: Response) {
        const users = await prisma.users.findMany()
        return response.json({ message: "Lista de users", users })
    }
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(6),
            email: z.email(),
            password: z.string().min(6),
            role: z.enum(["admin", "member"])
        })
        const { name, email, password, role } = bodySchema.parse(request.body)
        const userWithSameEmail = await prisma.users.findUnique({ where: { email } })
        if (userWithSameEmail) {
            throw new AppError("Email already exists", 400)
        }
        const hashedPassword = await hash(password, 8)
        const user = await prisma.users.create({
            data: {
                name, email, password: hashedPassword, role: "member"
            }
        })
        const { password: _, ...userWithoutPassword } = user
        return response.json(userWithoutPassword)
    }
}
export { UsersController }