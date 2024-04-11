import prisma from "../../prisma/prismaClient";
import RecipesList from "../components/RecipesList";
import AddRecipeButton from "./AddRecipeButton";

export default async function Home() {
  async function getAllrecipes() {
    try {
      const recipes = await prisma.recipe.findMany();
      return recipes;
    } catch(error) {
      console.log(error);
    }
  };

  const recipes = await getAllrecipes();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <AddRecipeButton />
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex mt-[64px]">
        {recipes && <RecipesList recipes={recipes} />}
      </div>
    </main>
  );
}
