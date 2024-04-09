import prisma from "../../prisma/prismaClient";
import RecipesList from "@/components/recipesList/RecipesList";

export default async function Home() {
  async function getAllrecipes() {
    try {
      const recipes = await prisma.recipe.findMany();
      return recipes;
    } catch(error) {
      console.log(error);
    }
  };

  async function deleteRecipe(currentId: number) {
    try {
      await prisma.recipe.delete({
        where: {
          id: currentId,
        },
      });
    } catch(error) {
      console.log(error);
    }
  };

  const recipes = await getAllrecipes();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {recipes && <RecipesList recipes={recipes} />}
      </div>
    </main>
  );
}
