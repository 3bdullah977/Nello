import BoardCard from "./board-card";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCard from "./create-board-card";
import { useEffect, useState } from "react";
import { Board, getBoards } from "@/service/board";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function BoardsList() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryFn: () => getBoards(token),
    queryKey: ["boards"],
  });

  useEffect(() => {
    if (!token) navigate("/login");
  }, [data]);

  if (isLoading) return <>loading...</>;

  return (
    <div className="flex flex-col py-6 px-16">
      <div className="text-xl mb-4 flex justify-between items-center">
        <h3>Your Boards</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>
              <Plus size={16} />
              <p>Add new board</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new board</DialogTitle>
              <DialogDescription>
                <CreateCard setOpen={setOpen} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="boards-list w-full">
        {data &&
          data.data.data.map((board: Board) => (
            <BoardCard key={board.id} card={board} />
          ))}
      </div>
    </div>
  );
}

export default BoardsList;
