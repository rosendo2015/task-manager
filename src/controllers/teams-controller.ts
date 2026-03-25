import { Request, Response } from "express"

class TeamsController {
    async create(request: Request, response: Response) {
        return response.json({ message: "team created success" })
    }
    async index(request: Request, response: Response) {
        return response.json({ message: "list team success" })
    }
}
export { TeamsController }