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
}
