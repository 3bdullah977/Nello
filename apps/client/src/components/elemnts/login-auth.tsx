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
// import { useState } from "react";
import axios from "axios";

export function DemoLoginAccount() {
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors }: string = formState;
  console.log(errors);

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log(data);
    const postData = await axios.post(
      "http://localhost:3001/api/v1/auth/login",
      {
        email: data.email,
        password: data.password,
      }
    );
    const resopnse = await postData.data;
    let token;
    if (sessionStorage.getItem("token") === null) {
      token = [];
    } else {
      token = JSON.parse(sessionStorage.getItem("token") ?? "");
    }
    token.push(resopnse.data.token);
    sessionStorage.setItem("token", JSON.stringify(token));
    // localStorage.clear();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  message: "invaild email address",
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
