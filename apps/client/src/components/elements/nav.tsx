import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../mode-toggle";
import { Search } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { User } from "@/service/user";
import { Link } from "react-router-dom";

function Nav() {
  const [user] = useLocalStorage("user", {} as User);
  const location = window.location.href.split("/").pop();
  return (
    <>
      {!(location === "login" || location === "register") && (
        <div className="nav flex justify-between p-8 pt-3 pb-3 shadow border-b">
          <div className="left flex flex-wrap gap-8 items-center">
            <div className="logo">
              <h1>Nello</h1>
            </div>
            <div className="boards">
              <Link
                to={"/boards"}
                className="hover:underline hover:text-primary"
              >
                Boards
              </Link>
            </div>
            <label htmlFor="search">
              <Search size={20} className="ml-2 absolute translate-y-2" />
              <Input name="search" className="input pl-8 w-96" />
            </label>
          </div>
          <div className="right flex flex-wrap gap-5 items-center">
            <ModeToggle />
            <Avatar className="w-9 h-9">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
