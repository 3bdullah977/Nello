import axios from 'axios'
export type CreateUserInput = {
    username: string;
    password: string;
    email: string;
}

const baseUrl = 'http://localhost:3001/api/users'
export const createUser = async (data: CreateUserInput) => {
    const url = baseUrl
    const user = await axios

}