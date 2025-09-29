import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import React from "react";

type UserBioProps = React.PropsWithChildren & {
  header: React.ReactNode;
};

function Bio({ children, header }: UserBioProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4 h-7">{header}</div>
      <Card className="lg:w-lg p-4 mb-4">{children}</Card>
    </>
  );
}

export default Bio;
