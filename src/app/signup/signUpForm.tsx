"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";
import { HookFormInput as Input } from "../../components/HookFormInput";
import useZodForm from "../../hooks/useZodForm";
import { z } from "zod";

export const schema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm({
    schema,
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((formData) => {
    setError(null);
    if (formData.password === formData.confirmPassword) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        signInWithEmailAndPassword(auth, formData.email, formData.password).then(() => {
          router.push("/");
        });
      })
      .catch(error => {
        setError(error.message)
      });
    } else {
      setError("Password do not match");
    }
  });

  return (
    <div>
      {!isSubmitting ? (
        <form
          className="grid h-[479px] max-w-[512px] ml-auto mr-auto"
        >
          { error && <div color="danger">{error}</div>}
          <div className="col-span-2 flex w-full flex-col gap-[34px]">
            <div className="flex flex-col gap-2">
              <label className="text-[20px] font-bold">Email</label>
              <Input
                className="w-full"
                placeholder="Email"
                name="email"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[20px] font-bold">Password</label>
              <Input
                className="w-full"
                placeholder="Password"
                name="password"
                type="password"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[20px] font-bold">Confirm password</label>
              <Input
                className="w-full"
                placeholder="Confirm password"
                name="confirmPassword"
                type="password"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex justify-center gap-4 pb-[40px]">
              <button
                onClick={onSubmit}
                className={`flex bg-[#ffffff7e] items-center justify-center gap-[13px] rounded-3xl border-2 border-black fill-rose px-[18px] py-[10px] text-[15px] text-black hover:border-[#009900]  hover:text-[#009900] disabled:border-[#10182066] disabled:text-[#10182066] xl:px-[22px] xl:text-l`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex h-[479px] w-[100%] items-center justify-center">
          loading
        </div>
      )}
    </div>
  )
}

export default SignUpForm;