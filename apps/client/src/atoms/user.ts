import { User } from "@/service/user";
import { atom } from "jotai";

export const userAtom = atom<User>({} as User);
