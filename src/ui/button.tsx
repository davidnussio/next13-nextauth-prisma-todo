"use client";

import { cn } from "~/lib/utils";

export type Props = JSX.IntrinsicElements["button"];

export const Button = ({ className, ...props }: Props) => {
  return (
    <button
      className={cn(
        "rounded-full px-10 py-3 font-semibold no-underline transition",
        "bg-white/10 text-white hover:bg-white/20",
        className
      )}
      {...props}
    />
  );
};
