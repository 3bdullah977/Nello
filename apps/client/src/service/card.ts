import axios from "axios";
import { authToken, baseUrl } from "./base";

export type Card = {
  id: number,
  title: string,
  description: string,
  coverImage: string,
  columnId: number,
  createdAt: string,
  updatedAt: string
}

export type AddCard  = {
  title: string,
  description: string,
  coverImage: string,
}

export const getCards = async (page: number = 1, limit: number = 10, boardId: number, columnId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards?page=${page}&limit=${limit}`
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const getCardById = async (id: number, boardId: number, columnId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards/${id}`
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const createCard =async (input:AddCard , boardId: number, columnId: number) => {
    const url = `${baseUrl}/boards/${boardId}/columns/${columnId}/cards`
    
    const data = await axios.post(url, input, {headers: {Authorization: authToken}})
    return data
}