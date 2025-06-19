import { Post } from "models/Post.model";
import { Request, Response } from "express";

export const obtenerPosts = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const posts = await Post.find().populate("userId", "nameUser");

    if (!posts) {
      res.status(204).json({ message: "No hay posts" });
    }
    console.log(posts);
    res.status(200).json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const obtenerPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const idUser = req.params.id;
    const posts = await Post.find({ userId: idUser }).populate(
      "userId",
      "nameUser"
    );

    if (!posts) {
      res.status(204).json({ message: "No hay posts" });
    }
    res.status(200).json(posts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
