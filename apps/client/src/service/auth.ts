import axios from "axios";
import { baseUrl } from "./base";

export type LoginUser = {
    id: number;
    email: string;
    password: string;
    username: string;
    isAdmin: boolean;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export const loginUser = async () => {
    const url = `${baseUrl}/auth/login`
    
    const data = await axios.post(url)
    return data
}
