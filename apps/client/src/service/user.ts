import axios from "axios";
import { authToken, baseUrl } from "./base";

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  isAdmin: string;
};

export type AddUser = {
  username: string;
  password: string;
  email: string;
};

export const getUsers = async (page: number = 1, limit: number = 10) => {
  const url = `${baseUrl}/users?page=${page}&limit=${limit}`;
  console.log(url);

  const data = await axios.get(url, { headers: { Authorization: authToken } });
  return data;
};

export const getUserById = async (id: number, token: string) => {
  const url = `${baseUrl}/users/${id}`;
  console.log(url);

  const data = await axios.get<{ data: User }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data);
  return data;
};

export const findUsersByName = async (name: string, token: string) => {
  const url = `${baseUrl}/users/${name}/findByName`;
  console.log(url);

  const data = await axios.get<{ data: User[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createUser = async (input: AddUser, token: string) => {
  const url = `${baseUrl}/users`;
  console.log(url);

  const data = await axios.post<{
    statusCode: number;
    message: string;
    data: User;
  }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addUserToBoard = async (
  boardId: number,
  userId: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/addUserToBoard`;
  console.log(url);

  const data = await axios.put(
    url,
    { userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
