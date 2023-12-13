import axios from "axios";
import { baseUrl } from "./base";

export type Comment = {
  id: number;
  content: string;
  cardId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

export type AddComment = {
  content: string;
};

export const getComments = async (
  cardId: number,
  page: number,
  limit: number,
  token: string
) => {
  const url = `${baseUrl}/boards/1/columns/1/cards/${cardId}/comments?page=${page}&limit=${limit}`;

  const data = await axios.get<{ data: Comment[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createComment = async (
  cardId: number,
  input: AddComment,
  token: string
) => {
  const url = `${baseUrl}/boards/1/columns/1/cards/${cardId}/comments`;

  const data = await axios.post<{
    message: string;
    statusCode: number;
    data: Comment;
  }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
