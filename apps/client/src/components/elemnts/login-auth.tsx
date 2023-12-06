// import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "@/service/auth";
import { useLocalStorage } from "usehooks-ts";
import { userAtom } from "@/atoms/user";
import { useAtom } from "jotai";
import { User } from "@/service/user";

export function DemoLoginAccount() {
  const form = useForm<LoginUser>();
  const { register, handleSubmit, formState, getValues } = form;
  const { errors } = formState;
  const [token, setToken] = useLocalStorage("token", "");
  const [, setLocalUser] = useLocalStorage("user", {} as User);
  const [, setUserLogin] = useAtom(userAtom);
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    const postData = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: data.email,
        password: data.password,
      }
    );
    const response = await postData.data;
    setToken(response.data.token);
    console.log(token);
    setUserLogin(response.data.user as User);
    setLocalUser(response.data.user as User);
    navigate("/boards");
  };

  return (
    <form onSubmit={handleSubmit(() => onSubmit(getValues()))} noValidate>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_^{1}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "invalid email address",
                },
                required: "email is required",
              })}
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "pass is required",
                minLength: {
                  value: 8,
                  message: "pass can not be less than 8 char",
                },
              })}
            />
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-white" type="submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
