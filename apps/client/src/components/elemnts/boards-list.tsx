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
import CreateCard from "./ceate-board-card";
// import axios from "axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBoards } from "../actions/get-board-action";
import { Board } from "@/service/board";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

function BoardsList() {
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();
  const dispatch: any = useDispatch();

  useEffect(() => {
    console.log(token);
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    dispatch(getBoards(token));
  }, [token, dispatch]);

  const { data } = useSelector(
    (state: { boards: { boards: { data: any } } }) => state.boards.boards
  );
  return (
    <div className="boards-list">
      {data &&
        data.data.map((card: Board) => <BoardCard key={card.id} card={card} />)}

      <Dialog>
        <DialogTrigger>
          <Card className="border border-dashed h-full flex items-center justify-center">
            <CardHeader>+ Add new board</CardHeader>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new board</DialogTitle>
            <DialogDescription>
              <CreateCard />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BoardsList;
