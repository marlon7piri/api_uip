import { Request, Response } from "express";

export const upgradePlan = async (
  req: Request,
  res: Response
): Promise<any> => {
  const url = "https://piriapp.vercel.app";
  try {
    res.json({ url });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
