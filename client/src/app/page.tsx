import Card from "@/components/ui/Card";
import ThemeSelect from "@/components/ui/ThemeSelect";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
  return (
    <Card className="flex w-[800px] mx-auto">
      <ThemeSelect />
    </Card>
  );
}
