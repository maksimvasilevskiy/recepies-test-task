"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HookFormInput as Input } from "./HookFormInput";
import NextImage from "next/image";
import close_icon from "../../public/icons/close.svg";
import useZodForm from "../hooks/useZodForm";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import EditorButton from "./EditorButton";
import { MuiChipsInput } from "mui-chips-input";
import { upsertRecipe, getIngredients } from "../actions";
import type { Ingredient } from "@prisma/client";

export const schema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Recipe title is required"),
  imageUrl: z.string().min(1, "Image url is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().array(),
});

interface Props {
  onSuccess?: () => void;
  isOpen: boolean;
  handleClose: () => void;
  defaultValues?: {
    id?: number,
    name: string,
    imageUrl: string,
    description: string,
    instructions: string[],
    ingredientsAmount: {
      id: number,
      ingredientId: number,
      amount: number,
    }[],
  }
}

const RecipeForm: React.FC<Props> = ({
  onSuccess,
  isOpen,
  handleClose,
  defaultValues,
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<{
    ingredientId: number;
    amount: number;
  }[]>(defaultValues?.ingredientsAmount.length ? defaultValues.ingredientsAmount : []);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(null);
  const [ingredientAmount, setIngredientAmount] = useState<number>(0);
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema,
    mode: "onBlur",
    defaultValues: defaultValues || {
      name: "",
      imageUrl: "",
      description: "",
      instructions: [],
      ingredientsAmount: [],
    },
  });

  useEffect(() => {
    const getData = async () => {
      const ingredients = await getIngredients();
      if (ingredients) {
        setIngredients(ingredients);
        setCurrentIngredient(ingredients[0]);
      }
    }
    getData();
  }, []);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result = await upsertRecipe({
        data: {
          ...formData,
        },
        selectedIngredients,
      });
    } catch (e) {
      console.log(e);
    }
    reset();
    router.refresh();
    onSuccess && onSuccess();
    handleClose();
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.currentTarget.selectedOptions[0].id;
    const currentIngredient = ingredients.find((elem) => elem.id === Number(selectedId));
    if (currentIngredient) {
      setCurrentIngredient(currentIngredient);
    }
  };

  const handleAddIngredient = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (currentIngredient && ingredientAmount > 0) {
      if (selectedIngredients.find((elem) => currentIngredient.id === elem.ingredientId)) {
        return;
      }
      setSelectedIngredients([
        ...selectedIngredients,
        {
          ingredientId: currentIngredient.id,
          amount: ingredientAmount,
        }
      ]);
      setCurrentIngredient(ingredients[0]);
      setIngredientAmount(0);
    }
  };

  const handleDeleteIngredient = (id: number) => {
    setSelectedIngredients(selectedIngredients.filter((ingredient) => ingredient.ingredientId !== id));
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        static
        className="relative z-50"
        open={isOpen}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-2/4 h-[90%] overflow-y-auto rounded-xl  bg-white p-[40px] text-left shadow-xl">
              <div className="flex flex-col bg-white pb-[40px]">
                <div className="flex w-[99%] justify-between">
                  <Dialog.Title className="text-2xl font-bold">
                    {defaultValues?.id
                      ? "Edit recipe"
                      : "Add recipe"}
                  </Dialog.Title>
                  <button onClick={handleClose} className="focus:outline-none">
                    <NextImage alt="plus" src={close_icon} />
                  </button>
                </div>
              </div>
              {!isSubmitting ? (
                <form
                  onSubmit={onSubmit}
                  className="grid h-[479px]"
                >
                  <div className="col-span-2 flex w-full flex-col gap-[34px]">
                    <div className="flex flex-col gap-2">
                      <label className="text-[20px] font-bold">Recipe title</label>
                      <Input
                        className="w-full"
                        placeholder="Recipe title"
                        name="name"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[20px] font-bold">Recipe image url</label>
                      <Input
                        className="w-full"
                        placeholder="Image url"
                        name="imageUrl"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[20px] font-bold">Recipe description</label>
                      <Input
                        className="w-full"
                        placeholder="Recipe description"
                        name="description"
                        register={register}
                        errors={errors}
                        isTextArea={true}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[20px] font-bold">Instructions</label>
                      <Controller
                        control={control}
                        name="instructions"
                        render={({ field }) => (
                          <MuiChipsInput
                            className="[&>div]:flex [&>div]:flex-col [&>div]:justify-start [&>div>input]:mr-auto [&>div>fieldset]:border-hidden"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[20px] font-bold">Ingredinets</label>
                      {selectedIngredients.map((obj) => {
                        return <div key={obj.ingredientId} className="flex items-center">
                          <span>
                            {`${ingredients.find((elem) => elem.id === obj.ingredientId)?.title}: ${obj.amount} grams`}
                          </span>
                          <button
                            onClick={() => handleDeleteIngredient(obj.ingredientId)}
                            className="focus:outline-none ml-4"
                          >
                            <NextImage alt="plus" src={close_icon} />
                          </button>
                        </div>;
                      })}
                      <div className="flex items-end border-t-[1px] border-solid border-black w-max pt-3">
                        <div className="mr-4 flex flex-col">
                          <label>Ingredient</label>
                          <select
                            className={`
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                            [&::-webkit-inner-spin-button]:appearance-none rounded-xl border border-ebony 
                            border-opacity-60 w-[128px] py-[13px] pl-[17px] focus:outline-none h-[52px] mt-3
                            `}
                            onChange={(e) => handleSelectChange(e)}
                          >
                            {ingredients.map((ingredient, i) => (
                              <option key={ingredient.title} id={String(ingredient.id)}>
                                {ingredient.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mr-4 flex flex-col">
                          <label>Amount in grams</label>
                          <input
                            type="number"
                            className={`
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                              [&::-webkit-inner-spin-button]:appearance-none w-[128px] rounded-xl border 
                              border-ebony border-opacity-60 py-[13px] pl-[17px] focus:outline-none mt-3
                            `}
                            value={ingredientAmount}
                            onChange={(e) => setIngredientAmount(Number(e.currentTarget.value))}
                          ></input>
                        </div>
                        <button
                          className="h-[45px] flex bg-[#ffffff7e] items-center justify-center gap-[13px] rounded-3xl border-2 border-black fill-rose px-[18px] py-[10px] text-[15px] text-black hover:border-[#009900]  hover:text-[#009900] disabled:border-[#10182066] disabled:text-[#10182066] xl:px-[22px] xl:text-l"
                          onClick={(e) => handleAddIngredient(e)}
                        >
                          Add ingredient
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pb-[40px]">
                      <EditorButton
                        className="bg-sea-green text-white disabled:border-none disabled:bg-ebony disabled:bg-opacity-20 disabled:text-ebony disabled:text-opacity-20"
                        label={
                          isSubmitting
                            ? "Please wait"
                            : defaultValues?.id
                              ? "Save recipe"
                              : "Add recipe"
                        }
                        type="button"
                        disabled={isSubmitting}
                        onClick={onSubmit}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <div className="flex h-[479px] w-[100%] items-center justify-center">
                  loading
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecipeForm;