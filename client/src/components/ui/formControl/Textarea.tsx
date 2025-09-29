import { cn } from "@/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { useFormControl } from ".";

const textareaVariabts = cva("p-2 w-full outline-none resize-none", {
  variants: {
    size: {
      small: "text-xs",
      medium: "text-base",
      large: "text-lg",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

function Textarea({
  size,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariabts>) {
  const { id } = useFormControl();
  return (
    <div className="ring-2 block ring-primary-500 rounded-sm focus-within:ring-primary-400 hover:ring-primary-400 transition-all">
      <textarea
        {...props}
        id={id}
        className={cn(textareaVariabts({ size }), className)}
      />
    </div>
  );
}

export default Textarea;
