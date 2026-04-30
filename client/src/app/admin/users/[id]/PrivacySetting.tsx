import Typography from "@/components/ui/Typography";
import React from "react";

type PrivacySettingProps = {
  label: string;
  setting: string;
};

function PrivacySetting({ label, setting }: PrivacySettingProps) {
  return (
    <div className="border-b-[1px] border-border mb-4">
      <Typography>{label}</Typography>
      <Typography color="muted">{setting}</Typography>
    </div>
  );
}

export default PrivacySetting;
