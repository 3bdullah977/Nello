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
// import { useState } from "react";
import axios from "axios";

type authData = {
  userName: string;
  email: string;
  password: string;
  errors: {
    userName: {
      message: string;
    };
    email: {
      message: string;
    };
    password: {
      message: string;
    };
  };
};

export function DemoCreateAccount() {
  const form = useForm();
  const { register, handleSubmit, formState }: any = form;
  const { errors }: any = formState;
  console.log(errors);

  const onSubmit = async (data: authData) => {
    console.log(data);
    await axios.post("http://localhost:3001/api/v1/users", {
      username: data.userName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="userName">User name</Label>
            <Input
              id="userName"
              type="userName"
              {...register("userName", {
                required: "user-name is required",
              })}
            />
            <p className="text-red-500">{errors.userName?.message}</p>
          </div>
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
            Create account
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
