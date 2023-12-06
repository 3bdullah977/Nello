import axios from "axios";
import { authToken, baseUrl } from "./base";

export type Card = {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  columnId: number;
  createdAt: string;
  updatedAt: string;
};

export type AddCard = {
  title: string;
  description: string;
  coverImage: string;
};

export type CardResponse = {
  messsage: string;
  statusCode: number;
  data: Card[] | Card;
};

export const getCards = async (
  boardId: number,
  columnId: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards`;

  const data = await axios.get<CardResponse>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getCardById = async (
  id: number,
  boardId: number,
  columnId: number
) => {
  const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards/${id}`;

  const data = await axios.get(url, { headers: { Authorization: authToken } });
  return data;
};

export const createCard = async (
  input: AddCard,
  boardId: number,
  columnId: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards`;

  const data = await axios.post(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
