import axios from "axios";
import { baseUrl } from "./base";

export type Document = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  boardId: string;
};

export type AddDocument = {
  name: string;
  content?: string;
};

export const getDocuments = async (
  boardId: number,
  page: number,
  limit: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/documents?page=${page}&limit=${limit}`;

  const data = await axios.get<{ data: Document[] }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const getDocumentById = async (
  boardId: string,
  id: number,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/documents/${id}`;

  const data = await axios.get<{ data: Document }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createDocument = async (
  boardId: string,
  input: AddDocument,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/documents`;

  const data = await axios.post<{
    message: string;
    statusCode: number;
    data: Document;
  }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateDocument = async (
  documentId: number,
  boardId: string,
  input: Partial<AddDocument>,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/documents/${documentId}`;

  const data = await axios.patch<{ data: Document }>(url, input, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteDocument = async (
  documentId: string,
  boardId: string,
  token: string
) => {
  const url = `${baseUrl}/boards/${boardId}/documents/${documentId}`;

  const data = await axios.delete<{ data: Document }>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
