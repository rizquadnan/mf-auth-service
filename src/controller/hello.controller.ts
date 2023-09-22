import { Request, Response } from "express";

export const Hello = (req: Request, res: Response) => {
  return res.json({ message: "Hello! This is a public API. Not authenticated"})
}