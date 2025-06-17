import { IPost, Post } from "models/Post.model";

export const crearPost = async (post: IPost) => {
  const { url, public_id, userId } = post;
  // Guardar en base de datos
  const newPost = new Post({
    url: url,
    public_id: public_id,
    userId: userId,
  });

  const savedPost = await newPost.save();

  return savedPost;
};
