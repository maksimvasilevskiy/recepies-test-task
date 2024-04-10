import _ from "lodash";
import { type InputHTMLAttributes } from "react";
import {
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  label?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  inputClassName?: string;
  isTextArea?: boolean;
};

export function HookFormInput<T extends FieldValues>({
  name,
  register,
  errors,
  className = "mb-5",
  inputClassName = "",
  required,
  label = "",
  isTextArea = false,
  ...rest
}: Props<T>) {
  const error = _.get(errors, name) as FieldError | undefined;
  const labelName = label ?? String(name);

  return (
    <fieldset className={`relative flex flex-col ${className}`}>
      {labelName
      &&
      <label
        className="text-form-text-xs xl:text-form-text"
      >
        {labelName}
      </label>
      }
      {!isTextArea
      ?
      <input
        id={name}
        className={`
            rounded-xl border border-ebony border-opacity-60 py-[13px] pl-[17px] focus:outline-none ${inputClassName}
        `}
        type={rest.type}
        {...register(name, {
          valueAsNumber: rest.type === "number",
          required,
        })}
        {...rest}
      />
      :
      <textarea
        id={name}
        className={`
            rounded-xl border border-ebony border-opacity-60 py-[13px] pl-[17px] focus:outline-none ${inputClassName}
        `}
        {...register(name, {
          valueAsNumber: rest.type === "number",
          required,
        })}
      ></textarea>
      }

      {error?.message && (
        <p className="absolute bottom-[-20px] mx-5 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </fieldset>
  );
}

export default HookFormInput;
