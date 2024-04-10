"use client";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HookFormInput as Input } from "./HookFormInput";
import NextImage from "next/image";
import close_icon from "../../public/icons/close.svg";
import useZodForm from "../hooks/useZodForm";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import EditorButton from "./EditorButton";

export const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Recipe title is required"),
  url: z.string().min(1, "Image url is required"),
  description: z.string().min(1, "Description is required"),
});

interface Props {
  onSuccess?: () => void;
  isOpen: boolean;
  handleClose: () => void;
}

const RecipeForm: React.FC<Props> = ({
  onSuccess,
  isOpen,
  handleClose,
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
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const onSubmit = handleSubmit(async (formData) => {
    console.log("Form data submitted:", formData);

    console.log("selectedImage");
    console.log(selectedImage);
    reset();
    router.refresh();
    onSuccess && onSuccess();
    handleClose();
    console.log("Image details successfully saved.");
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
            <Dialog.Panel className="w-2/4 overflow-hidden rounded-xl  bg-white p-[40px] text-left shadow-xl">
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
                        name="title"
                        register={register}
                        errors={errors}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label>Recipe image url</label>
                      <Input
                        className="w-full"
                        placeholder="Image url"
                        name="url"
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
                  </div>
                </form>
              ) : (
                <div className="flex h-[479px] w-[100%] items-center justify-center">
                  loading
                </div>
              )}
              <div className="flex justify-end gap-4">
                <EditorButton
                  className="bg-sea-green text-white disabled:border-none disabled:bg-ebony disabled:bg-opacity-20 disabled:text-ebony disabled:text-opacity-20"
                  label={
                    isSubmitting
                      ? "Please wait"
                      : "Add Recipe"
                  }
                  type="button"
                  disabled={isSubmitting}
                  onClick={onSubmit}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecipeForm;
