import React from "react";
import { cn } from "@/lib/cn";
import Typography from "../Typography";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table className={cn("w-full mb-4", className)} {...props} />;
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "bg-background-lighter xl:rounded-none rounded-lg border-[1px] border-border xl:border-0 xl:p-0 p-4 xl:bg-transparent xl:border-b-[1px] border-b-white/20 transition-colors duration-100 ease-in-out block xl:table-row",
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  className,
  children,
  rowName,
  ...props
}: React.ComponentProps<"td"> & { rowName?: string }) {
  const content = children || (
    <Typography color="muted" bold>
      None
    </Typography>
  );
  return (
    <td
      className={cn(
        "not-last-of-type:border-b-[1px] border-b-border xl:border-0  py-2 px-2 block xl:table-cell xl:text-left text-right",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center">
        <Typography bold className="block xl:hidden">
          {rowName}
        </Typography>
        <Typography as="span"> {content}</Typography>
      </div>
    </td>
  );
}

export function THeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("font-black hidden xl:table-header-group", className)}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn(
        "xl:[&_tr:hover]:bg-background/50 grid grid-cols-1 lg:grid-cols-2 xl:table-row-group gap-4",
        className,
      )}
      {...props}
    />
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn("p-2 text-left text-muted hidden xl:table-cell", className)}
      {...props}
    />
  );
}

export function TableDescription(
  props: React.ComponentProps<typeof Typography>,
) {
  return <Typography color="muted" size="sm" {...props} />;
}
