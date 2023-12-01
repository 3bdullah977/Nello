export type CreateUserInput = {
    username: string;
    password: string;
    email: string;
}

const baseUrl = 'http://localhost:3001/api/users'
export const createUser = (data: CreateUserInput) => {
    const url = baseUrl

}