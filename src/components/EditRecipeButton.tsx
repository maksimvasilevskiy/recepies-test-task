"use client"
import React, { useState } from "react";
import Image from "next/image";
import type { Recipe } from "@prisma/client";
import RecipeForm from "./RecipeForm";

type EditRecipeButtonProps = {
  recipe: Recipe;
};

const EditRecipeButton = ({
  recipe
}: EditRecipeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Image
          className="cursor-pointer"
          alt="edit-button"
          width={32}
          height={32}
          src={"/icons/edit-button.svg"}
          onClick={() => setIsOpen(true)}
      />
      <RecipeForm
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        defaultValues={{
          ...recipe
        }}
      />
    </>
  );
};

export default EditRecipeButton;
