import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: { }, // Valeur initiale
});
// import { atom } from 'recoil';

// // Définition du type User
// export type User = {
//   id: string;
//   imageUrl: string;
//   emailAddresses: { emailAddress: string }[];
//   firstName: string;
//   lastName: string;
//   username: string;
//   createdAt: string;
// };

// // Type pour l'état global
// export interface UserState {
//   user?: User;
//   isLoggedIn?: boolean;
// }

// // Valeur par défaut de l'état
// const defaultUserState: UserState = {
//   user: undefined,
//   isLoggedIn: false
// };

// // Création de l'atome
// export const userState = atom<UserState>({
//   key: 'userState', // Identifiant unique obligatoire pour l'atome
//   default: defaultUserState,
// });