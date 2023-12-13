import axios from "axios";
import { baseUrl } from "./base";

export type Drawing = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  boardId: string;
};

export type AddDrawing = {
  name: string;
  content?: string;
};

export const getDrawings = async (
  boardId: number,
  page: number,
  limit: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/drawings?page=${page}&limit=${limit}`;

  const data = await axios.get<{ data: Drawing[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getDrawingById = async (
  boardId: string,
  id: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/drawings/${id}`;

  const data = await axios.get<{ data: Drawing }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createDrawing = async (
  boardId: string,
  input: AddDrawing,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/drawings`;

  const data = await axios.post<{
    message: string;
    statusCode: number;
    data: Drawing;
  }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateDrawing = async (
  drawingId: number,
  boardId: string,
  input: Partial<AddDrawing>,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/drawings/${drawingId}`;

  const data = await axios.patch<{ data: Drawing }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteDrawing = async (
  documentId: string,
  boardId: string,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/drawings/${documentId}`;

  const data = await axios.delete<{ data: Drawing }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
