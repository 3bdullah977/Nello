import axios from "axios";
import { authToken, baseUrl } from "./base";

export type User = {
    id: number;
    username: string;
    password: string;
    email: string;
    createdAt: string;
    updatedAt: string
    imageUrl: string;
    isAdmin: string
}

export type AddUser = {
    username: string;
    password: string;
    email: string;
}

export const getUsers = async (page: number = 1, limit: number = 10) => {
    const url = `${baseUrl}/users?page=${page}&limit=${limit}`
    console.log(url)
    
    const data = await axios.get(url, {headers: {Authorization: authToken}})
    return data
}

export const createUser =async (input:AddUser) => {
    const url = `${baseUrl}/users`
    console.log(url)
    
    const data = await axios.post(url, input, {headers: {Authorization: authToken}})
    return data
}