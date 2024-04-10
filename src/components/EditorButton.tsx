import React, { type ButtonHTMLAttributes } from "react";
import Image from "next/image";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  img?: string;
  imgColor?: string;
  className?: string;
};

const EditorButton = ({
  className,
  imgColor,
  label,
  img,
  ...rest
}: ButtonProps) => {
  return (
    <div>
      <button
        className={`flex bg-[#ffffff7e] items-center justify-center gap-[13px] rounded-3xl border-2 border-black fill-rose px-[18px] py-[10px] text-[15px] text-black hover:border-[#009900]  hover:text-[#009900] disabled:border-[#10182066] disabled:text-[#10182066] xl:px-[22px] xl:text-l`}
        {...rest}
      >
        {img && (
          <Image
            className={`fill-current ${imgColor || "text-current"}`}
            src={img}
            alt="button_image"
          />
        )}
        <span>{label}</span>
      </button>
    </div>
  );
};

export default EditorButton;
