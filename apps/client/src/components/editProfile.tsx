// import { useLocalStorage } from "usehooks-ts";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "@/components/ui/input";
import { User } from "@/service/user";
import { useLocalStorage } from "usehooks-ts";

const EditProfile = () => {
  const [user] = useLocalStorage("user", {} as User);

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-3">
      <Card className="max-w-[600px] w-full ">
        <CardHeader>
          <div>
            <h1 className="text-2xl">Change Info</h1>
            <p className="text-sm text-muted-foreground">
              changes will be reflected
            </p>
          </div>
          <div className="flex gap-5 text-xs mt-6 pt-2 pb-4 items-center">
            <div className="w-12 h-12 overflow-clip rounded-md">
              <img src={user.imageUrl} alt={user.username} className="h-full" />
            </div>
            <Input type="file"></Input>
            <p className="uppercase text-muted-foreground text-sm">photo</p>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div>
            <label>Name</label>
            <div>
              <Input placeholder="Enter your name..." />
            </div>
          </div>
          <div className="mt-4">
            <label>Email</label>
            <div>
              <Input placeholder="Enter your email..." />
            </div>
          </div>
          <div className="mt-4">
            <label>Password</label>
            <div>
              <Input placeholder="Enter your new password..." />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;
