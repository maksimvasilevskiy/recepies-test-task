"use server";
import prisma from "../prisma/prismaClient";
import type { Ingredient } from "@prisma/client";

export async function getIngredients() {
  try {
    return await prisma.ingredient.findMany();
  } catch(error) {
    console.log(error);
  }
};

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

export async function upsertRecipe({
  data,
  selectedIngredients
}: {
  data: {
    id?: number;
    name: string;
    description: string;
    imageUrl: string;
    instructions: string[];
  },
  selectedIngredients: {
    ingredientId: number;
    amount: number;
  }[],
}) {
  if (!data.id) {
    return prisma.recipe.create({
      data: {
        ...data,
        ingredientsAmount: {
          create: selectedIngredients.map((ingredient) => {
            return {
              ingredientId: ingredient.ingredientId,
              amount: ingredient.amount,
            };
          }),
        }
      },
    });
  } else {
    return prisma.recipe.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        instructions: data.instructions,
      },
    });
  }
}