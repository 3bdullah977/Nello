// import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, redirect, useNavigate } from "react-router-dom";
import { LoginUser } from "@/service/auth";
import { useLocalStorage } from "usehooks-ts";
import { userAtom } from "@/atoms/user";
import { useAtom } from "jotai";
import { User } from "@/service/user";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginUser>();
  const [, setToken] = useLocalStorage("token", "");
  const [user, setLocalUser] = useLocalStorage("user", {} as User);
  const [, setUserLogin] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user) redirect("/boards");
  }, []);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const postData = await axios.post(
        "http://localhost:3001/api/v1/auth/login",
        {
          email: data.email,
          password: data.password,
        }
      );
      const response = postData.data;
      if (response.statusCode === 200)
        toast({
          title: "Login in successfully",
          description: response.message,
        });
      setToken(response.data.token);
      setUserLogin(response.data.user as User);
      setLocalUser(response.data.user as User);
      navigate("/boards");
    } catch (e: any) {
      toast({
        title: "Error happened when logging in",
        description: e.response.data.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(() => onSubmit(getValues()))} noValidate>
      <Card className="max-w-[500px] min-w-[360px] absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email", {
                required: true,
                pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              })}
              id="email"
              type="email"
              placeholder="m@example.com"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type === "required" && (
              <div className="text-red-900 text-sm">Email is required</div>
            )}
            {errors.email?.type === "pattern" && (
              <div className="text-red-900 text-sm">
                Email should be an email
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password", { required: true, min: 8 })}
              id="password"
              type="password"
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.email?.type === "min" && (
              <div className="text-red-900 text-sm">
                password should be bigger than 8 characters
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="block">
          <Button className="w-full">Login</Button>
          <p className="text-gray-700 text-sm text-center mt-3">
            Do not have an account?{" "}
            <Link
              className="hover:text-primary hover:underline"
              to={"/register"}
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
