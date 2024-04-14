"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  ingredients: string[];
}

export default function IngredientsFilter({ ingredients }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleClick = (filter: string) => {
    const filtered = searchParams
      .getAll("filter")
      .filter((item) => item !== filter);
    if (
      filtered.length === 0 &&
      searchParams.getAll("filter").includes(filter)
    ) {
      return pathname;
    }
    return searchParams.getAll("filter").includes(filter)
      ? `${pathname}?filter=${searchParams
          .getAll("filter")
          .filter((item) => item !== filter)
          .join("&filter=")}`
      : `${pathname}?${String(searchParams)}&${new URLSearchParams({
          filter,
        }).toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-[10px]">
      {ingredients.map((ingredient) => (
        <Link
          href={handleClick(ingredient)}
          key={ingredient}
          className={`${
            searchParams.getAll("filter").includes(ingredient)
              ? "border-[#009900] text-[#009900]"
              : ""
          } flex bg-[#ffffff7e] items-center justify-center gap-[13px] rounded-3xl border-2 border-white w-max cursor-pointer rounded-lg border border-sea-green px-8 py-2 text-sea-green transition focus:outline-none hover:border-[#009900] hover:text-[#009900]`}
        >
          {ingredient}
        </Link>
      ))}
    </div>
  );
}
