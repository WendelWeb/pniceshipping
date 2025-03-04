export type UserType = {
  id: string;
  imageUrl: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
  lastActiveAt: string;
  phoneNumbers: string[];      // Add this
  banned: boolean;            // Add this
  twoFactorEnabled: boolean;
};