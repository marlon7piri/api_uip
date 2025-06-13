import { Document, Model } from "mongoose";

export const verifyAutorId = async <T extends Document>(
  modelo: Model<T>,
  autorId: string
): Promise<boolean> => {
  const exist = await modelo.exists({ autorId });
  return !!exist;
};
