"use client"
import Image from "next/image";
import { type Prisma } from "@prisma/client";
import { deleteRecipe } from "@/actions";
import { useRouter } from "next/navigation";

interface RecipesListProps {
    recipes: Prisma.RecipeGetPayload<{}>[];
}

const RecipesList: React.FC<RecipesListProps> = ({
    recipes
}) => {
    const router = useRouter();
    const handleDelete =  async (id: number) => {
        await deleteRecipe(id);
        router.refresh();
    }
    return (
        <ul>
            {recipes.map((recipe, i) => 
                <li
                    key={recipe.id}
                    className={
                        `items-center rounded-[25px] border-[1px] border-solid border-white p-[24px] 
                        flex justify-between bg-[#ffffff7e] ${i > 0 ? "mt-[24px]" : ""}`
                    }
                >
                    <Image className="rounded-[10px] shrink-0" alt="recipe-image" width={150} height={150} src={recipe.imageUrl} />
                    <div className="ml-[24px]">
                        <div className="font-bold text-[24px]">{recipe.name}</div>
                        <div className="text-[18px] mt-[12px] leading-6">{recipe.description}</div>
                    </div>
                    <Image
                        className="cursor-pointer"
                        alt="delete-button"
                        width={32}
                        height={32}
                        src={"/icons/delete-button.svg"}
                        onClick={() => handleDelete(recipe.id)}
                    />
                </li>
            )}
        </ul>
    );
}


export default RecipesList;