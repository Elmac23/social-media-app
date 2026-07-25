"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions";
import Select, { Option } from "./ui/formControl/Select";

export default function LanguageSelect({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(locale: string) {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <Select
      size="small"
      value={currentLocale}
      disabled={isPending}
      setValue={(v: string) => onChange(v)}
    >
      <Option value="en">English</Option>
      <Option value="pl">Polski</Option>
    </Select>
  );
}
