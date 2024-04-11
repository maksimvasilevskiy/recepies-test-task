"use server";
import prisma from "../prisma/prismaClient";

export async function deleteRecipe(id: number) {
  try {
    await prisma.recipe.delete({
      where: {
        id: id,
      },
    });
  } catch(error) {
    console.log(error);
  }
};

export async function addRecipe(data: {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  instructions: string[];
}) {
  if (!data.id) {
    return prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        instructions: data.instructions,
      },
    });
  }
}