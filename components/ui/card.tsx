import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md", className)}
      {...props}
    />
  );
}
