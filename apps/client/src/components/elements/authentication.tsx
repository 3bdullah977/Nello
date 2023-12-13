import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Github, Facebook } from "lucide-react";

function Authentication() {
  return (
    <div className="authentication">
      <Card className="card">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor="" className="flex gap-2 ">
            <Mail size={20} className="ml-2 absolute translate-y-1.5" />
            <Input type="email" className="border  pl-9" />
          </label>
          {/* <div className="pass-input auth-input flex items-center mt-5 mb-5 rounded"> */}

          <label htmlFor="" className="flex gap-2 mt-3 mb-3">
            <Lock size={20} className="ml-2 absolute translate-y-1.5" />
            <Input type="password" className="border  pl-9" />
          </label>

          {/* </div> */}
          <Button variant="blue" size={"default"} className="auth-btn">
            Login
          </Button>
        </CardContent>
        <CardFooter className="card-footer">
          <p className="text-muted-foreground">
            or continue with social profile
          </p>
          <div className="social m-3">
            <Github size={30} className="icon rounded-xl p-1" />
            <Facebook size={30} className="icon rounded-xl p-1" />
          </div>
          <p className="text-muted-foreground">
            Dont't have an account yet?{" "}
            <span className="text-blue-600">Register</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Authentication;
