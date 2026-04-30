import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { UserPrivacy } from "@/types/user";
import PrivacySetting from "./PrivacySetting";

function UserPrivacyCard({ privacy }: { privacy: UserPrivacy }) {
  return (
    <Card>
      <Typography as="h3" size="lg" bold className="mb-4">
        Privacy
      </Typography>
      <div className="grid gap-4 grid-cols-2">
        <PrivacySetting label="Email" setting={privacy.email} />
        <PrivacySetting label="Date of Birth" setting={privacy.dateOfBirth} />
        <PrivacySetting label="Location" setting={privacy.location} />
        <PrivacySetting label="Phone" setting={privacy.phoneNumber} />
        <PrivacySetting
          label="Primary Language"
          setting={privacy.primaryLanguage}
        />
        <PrivacySetting
          label="Other Languages"
          setting={privacy.otherLanguages}
        />
        <PrivacySetting label="Friends" setting={privacy.friendsList} />
        <PrivacySetting label="Hobbies" setting={privacy.hobbies} />
        <PrivacySetting label="Jobs" setting={privacy.jobs} />
        <PrivacySetting label="Schools" setting={privacy.schools} />
      </div>
    </Card>
  );
}

export default UserPrivacyCard;
