import axios from "axios";
import { baseUrl } from "./base";

export type LoginUser = {
  email: string;
  password: string;
};

export const loginUser = async (input: LoginUser) => {
  const url = `${baseUrl}/auth/login`;

  const data = await axios.post(url, input);
  return data;
};
