import axios from "axios";
import { authToken, baseUrl } from "./base";

export type Column = {
    id: number;
    name: string;
    position: number;
    createdAt: string;
    updatedAt: string
    boardId: number;
}

export type AddColumn = {
    name: string;
    position: number;
}

export const getColumns = async (page: number = 1, limit: number = 10, boardId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns?page=${page}&limit=${limit}`
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const getColumnById = async (id: number, boardId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns/${id}`;
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const createColumn =async (input:AddColumn, boardId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns`
    
    const data = await axios.post(url, input, {headers: {Authorization: authToken}})
    return data
}