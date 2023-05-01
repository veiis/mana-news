import express from "express";

type User = "id" | "role"

declare global {
    namespace Express {
        interface Request {
            user?: Record<User, any>
        }
    }
}