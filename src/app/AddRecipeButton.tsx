"use client";
import { useState } from "react";
import RecipeForm from "../components/RecipeForm";

export default function AddRecipeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex bg-[#ffffff7e] items-center justify-center gap-[13px] rounded-3xl border-2 border-white fill-rose px-[18px] py-[10px] text-[15px] text-black hover:border-[#009900]  hover:text-[#009900] disabled:border-[#10182066] disabled:text-[#10182066] xl:px-[22px] xl:text-lg"
      >
        <span>Add Recipe</span>
      </button>
      <RecipeForm
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
    </>
  );
}