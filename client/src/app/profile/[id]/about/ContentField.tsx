import Typography from "@/components/ui/Typography";
import React from "react";

type ContentFieldProps = React.PropsWithChildren & {
  label: string;
  value: string | null;
};

function ContentField({ label, value, children }: ContentFieldProps) {
  if (!value && !children) return null;
  return (
    <div className="flex items-center gap-4">
      <div>
        {value && <Typography>{value}</Typography>}
        {label && (
          <Typography
            size={value ? "sm" : "md"}
            color={value ? "muted" : "primary"}
          >
            {label}
          </Typography>
        )}
      </div>
      {children}
    </div>
  );
}

export default ContentField;
