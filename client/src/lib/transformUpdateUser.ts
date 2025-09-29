import { ProfilePartial } from "@/app/profile/[id]/about/ProfileMultiField";
import { UserData, UserProfile } from "@/types/user";

export function transformUpdateUser(data: ProfilePartial) {
  const transformed: Partial<UserProfile> = {
    userData: {},
  };

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith(":")) {
      const newKey = key.slice(1);
      transformed.userData![newKey as keyof UserData] = value;
    } else {
      transformed[key as keyof UserProfile] = value;
    }
  }
  return transformed;
}
