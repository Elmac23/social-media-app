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
