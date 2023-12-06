import axios from "axios";
import { authToken, baseUrl } from "./base";

export type ColumnType = {
  id: number;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  boardId: number;
};

export type AddColumn = {
  name: string;
};

export const getColumns = async (boardId: number, token: string) => {
  const url = `${baseUrl}/boards/${boardId}/columns`;

  const data = await axios.get<{
    message: string;
    data: ColumnType[];
    statusCode: number;
  }>(url, { headers: { Authorization: `Bearer ${token}` } });
  return data;
};

export const getColumnById = async (id: number, boardId: number) => {
  const url = `${baseUrl}/boards/${boardId}/columns/${id}`;

  const data = await axios.get(url, { headers: { Authorization: authToken } });
  return data;
};

export const createColumn = async (
  input: AddColumn,
  boardId: number,
  token: string,
) => {
  const url = `${baseUrl}/boards/${boardId}/columns`;

  const data = await axios.post(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
