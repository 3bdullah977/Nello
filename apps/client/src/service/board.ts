import axios from "axios";
import { baseUrl } from "./base";
import { User } from "./user";

export type Board = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  creatorId: number;
  isPrivate: boolean;
};

export type AddBoard = {
  name: string;
  imageUrl: string;
  creatorId: number;
  isPrivate: boolean;
};

export const getBoards = async (token: string) => {
  const url = `${baseUrl}/boards`;

  const data = await axios.get<{ data: Board[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getBoardById = async (id: number, token: string) => {
  const url = `${baseUrl}/boards/${id}`;

  const data = await axios.get<{ data: Board }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getBoardByName = async (name: string, token: string) => {
  const url = `${baseUrl}/boards/${name}/getByName`;

  const data = await axios.get<{ data: Board }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createBoard = async (input: AddBoard, token: string) => {
  const url = `${baseUrl}/boards`;

  const data = await axios.post<{ data: Board }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const listBoardMembers = async (id: number, token: string) => {
  const url = `${baseUrl}/boards/${id}/listBoardMembers`;

  const data = await axios.get<{ data: User[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addUserToBoard = async (
  id: number,
  userId: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${id}/addUserToBoard`;

  const data = await axios.put(
    url,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const removeUserFromBoard = async (
  id: number,
  userId: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${id}/removeUserFromBoard`;

  const data = await axios.put(
    url,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const toggleBoardVisibility = async (id: number, token: string) => {
  const url = `${baseUrl}/boards/${id}/toggleVisibility`;

  const data = await axios.put(
    url,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export const uploadBoardCover = async (
  id: number,
  boardCover: File,
  token: string
) => {
  const url = `${baseUrl}/boards/${id}/uploadCover`;

  await axios.put(
    url,
    { boardCover },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
