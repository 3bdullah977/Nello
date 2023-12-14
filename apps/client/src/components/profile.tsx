import { useLocalStorage } from "usehooks-ts";
import { Card, CardContent } from "./ui/card";
import { User } from "@/service/user";

const Profile = () => {
  const [user] = useLocalStorage("user", {} as User);

  return (
    <div className="min-h-screen w-full flex justify-center items-center px-3">
      <Card className="max-w-[600px] w-full">
        <CardContent className="w-full px-0">
          <div className="flex justify-between mt-6 mx-8 pb-4 items-center">
            <div className="uppercase text-muted-foreground text-sm">photo</div>
            <div className="w-10 h-10 overflow-clip rounded-md">
              <img src={user.imageUrl} alt={user.username} className="h-full" />
            </div>
          </div>
          <div className="h-0.5 bg-secondary" />
          <div className="flex justify-between mt-6 mx-8 pb-4 items-center">
            <div className="uppercase text-muted-foreground text-sm">
              username
            </div>
            <p>{user.username}</p>
          </div>

          <div className="h-0.5 bg-secondary " />
          <div className="flex justify-between mt-6 mx-8 items-center">
            <div className="uppercase text-muted-foreground text-sm">email</div>
            <p>{user.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
