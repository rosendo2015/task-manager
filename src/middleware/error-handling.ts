import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod"

export function errorHandling(error: Error, request: Request, response: Response, next: NextFunction) {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message })
    }
    if (error instanceof ZodError) {
        const formattedError = error.format(err => ({
            field: err.path.join('.'),
            message: err.message
        }))
        return response.status(400).json({ errors: formattedError })
    }
    return response.status(500).json({ message: error.message })
}