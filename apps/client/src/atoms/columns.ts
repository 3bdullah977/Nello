import { ColumnType } from "@/service/column";
import { atom } from "jotai";

export const columnsAtom = atom<ColumnType[]>([]);
