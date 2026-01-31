export type User = {
  id: string;
  login: string;
  email: string;
  avatarUrl?: string;
  name: string;
  lastname?: string;
  dateOfBirth?: string;
  bio?: string;
  isFollowed?: boolean;
  chatId?: string;
};

export type UserData = {
  sex?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  primaryLanguage?: string;
  otherLanguages?: string;
  schools?: string;
  jobs?: string;
  hobbies?: string;
};

export type UpdateUser = Partial<UserProfile>;

export type UserProfile = User & {
  userData?: UserData;
};

export type UserWithToken = User & {
  accessToken: string;
};

export type UserUpdateKey = keyof User | `:${keyof UserData}`;

export const PRIVACY_OPTIONS = ["PUBLIC", "FRIENDS", "PRIVATE"] as const;
export type PrivacyOptions = (typeof PRIVACY_OPTIONS)[number];

export type UserPrivacy = {
  email: PrivacyOptions;
  phoneNumber: PrivacyOptions;
  dateOfBirth: PrivacyOptions;
  primaryLanguage: PrivacyOptions;
  otherLanguages: PrivacyOptions;
  location: PrivacyOptions;
  schools: PrivacyOptions;
  hobbies: PrivacyOptions;
  jobs: PrivacyOptions;
  friendsList: PrivacyOptions;
};

export type UserPrivacyPartial = {
  email: PrivacyOptions;
  phoneNumber: PrivacyOptions;
  dateOfBirth: PrivacyOptions;
  primaryLanguage: PrivacyOptions;
  otherLanguages: PrivacyOptions;
  location: PrivacyOptions;
  schools: PrivacyOptions;
  hobbies: PrivacyOptions;
  jobs: PrivacyOptions;
  friendsList: PrivacyOptions;
};
