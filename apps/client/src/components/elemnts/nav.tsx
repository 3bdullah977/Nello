import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../mode-toggle";
import { Search } from "lucide-react";

function Nav() {
  return (
    <>
      <div className="nav flex justify-between p-8 pt-3 pb-3 shadow border-b">
        <div className="left flex flex-wrap gap-8 items-center">
          <div className="logo">
            <h1>Nello</h1>
          </div>
          <div className="boards">
            <h2>Boards</h2>
          </div>
          <label htmlFor="">
            <Search size={20} className="ml-2 absolute translate-y-2" />
            <Input className="input pl-8 w-96" />
          </label>
        </div>
        <div className="right flex flex-wrap gap-5 items-center">
          <ModeToggle />
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </>
  );
}

export default Nav;
