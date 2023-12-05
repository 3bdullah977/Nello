import axios from "axios";
import { authToken, baseUrl } from "./base";

export type Board = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string
    imageUrl: string;
    creatorId: number;
    isPrivate: boolean;
}

export type AddBoard = {
    name: string;
    imageUrl: string;
    creatorId: number;
    isPrivate: boolean;
}

export const getBoards = async (page: number = 1, limit: number = 10) => {
    const url = `${baseUrl}/boards?page=${page}&limit=${limit}`
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const getBoardById = async (id: number) => {
    const url = `${baseUrl}/boards/${id}`
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const createBoard =async (input:AddBoard) => {
    const url = `${baseUrl}/boards`
    
    const data = await axios.post(url, input, {headers: {Authorization: authToken}})
    return data
}