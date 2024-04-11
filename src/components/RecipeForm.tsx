"use client";
import { Fragment } from "react";
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
import { upsertRecipe } from "../actions";

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
  }
}

const RecipeForm: React.FC<Props> = ({
  onSuccess,
  isOpen,
  handleClose,
  defaultValues,
}) => {
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
    },
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const result = await upsertRecipe({
        ...formData
      });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
    reset();
    router.refresh();
    onSuccess && onSuccess();
    handleClose();
  });

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
                    Add Recipe
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
                      <label>Recipe title</label>
                      <Input
                        className="w-full"
                        placeholder="Recipe title"
                        name="name"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Recipe image url</label>
                      <Input
                        className="w-full"
                        placeholder="Image url"
                        name="imageUrl"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Recipe description</label>
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
                      <label>Instructions</label>
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