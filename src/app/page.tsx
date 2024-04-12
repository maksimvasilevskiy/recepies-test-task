import prisma from "../../prisma/prismaClient";
import RecipesList from "../components/RecipesList";
import AddRecipeButton from "./AddRecipeButton";
import IngredientsFilter from "../components/IngredientsFilter";

interface Props {
  searchParams: {
    filter: string[] | string;
    search?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  if (typeof searchParams.filter === "string") {
    searchParams.filter = [searchParams.filter];
  }

  async function getAllRecipes() {
    try {
      const recipes = await prisma.recipe.findMany({
        include: {
          ingredientsAmount: true,
        }
      });
      return recipes;
    } catch(error) {
      console.log(error);
    }
  };
  async function getAllIngredients() {
    try {
      const ingredients = await prisma.ingredient.findMany();
      return ingredients;
    } catch(error) {
      console.log(error);
    }
  };

  const getFilteredRecipes = async () => {
    const recipes = await getAllRecipes();
    const ingredients = await getAllIngredients();
    if (searchParams.filter) {
      const filteredIngredients = ingredients?.filter((elem) => searchParams.filter.includes(elem.title));
      const filteredIngredientsIds = filteredIngredients?.map((item) => item.id);
      return recipes?.filter((item) => item.ingredientsAmount.find((elem) => filteredIngredientsIds?.includes(elem.ingredientId)));
    } else {
      return recipes;
    }
  }
  
  const ingredientsNames = (await getAllIngredients())?.map((ingredient) => ingredient.title);
  const filteredRecipes = await getFilteredRecipes();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex justify-between w-full items-center max-w-5xl">
        <div>{ingredientsNames ? <IngredientsFilter ingredients={ingredientsNames} /> : ""}</div>
        <AddRecipeButton />
      </div>
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex mt-[64px]">
        {filteredRecipes && <RecipesList recipes={filteredRecipes} />}
      </div>
    </main>
  );
}
