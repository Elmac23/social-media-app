import z from 'zod';

export const privacySchema = z
  .enum(['PUBLIC', 'FRIENDS', 'PRIVATE'])
  .optional();

export const userPrivacySchema = z.object({
  email: privacySchema,
  phoneNumber: privacySchema,
  dateOfBirth: privacySchema,
  primaryLanguage: privacySchema,
  otherLanguages: privacySchema,
  location: privacySchema,
  schools: privacySchema,
  hobbies: privacySchema,
  jobs: privacySchema,
  friendsList: privacySchema,
});

export type UserPrivacyDto = z.infer<typeof userPrivacySchema>;
export type PrivacyLevel = z.infer<typeof privacySchema>;
