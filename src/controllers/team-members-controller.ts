import { Request, Response } from "express"

class TeamMembersController {
    async create(request: Request, response: Response) {
        return response.json({ message: "team_member created success" })
    }
    async index(request: Request, response: Response) {
        return response.json({ message: "list team_member success" })
    }
}
export { TeamMembersController }