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

function BoardsList() {
  // const [board, setBoards] = useState(null);

  // const getBoard = async () => {
  //   let token;
  //   if (sessionStorage.getItem("token") === null) {
  //     token = [];
  //   } else {
  //     token = JSON.parse(sessionStorage.getItem("token"));
  //   }
  //   const dataFetch = await axios.get(
  //     "http://localhost:3001/api/v1/boards?page=1&limit=15",
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   const resolve = await dataFetch.data.data;
  //   // console.log(resolve);
  //   setBoards(resolve);
  // };
  // console.log(boards);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBoards());
    // getBoard();
  }, []);

  const { data } = useSelector(
    (state: { boards: { boards: { data: Board[] } } }) => state.boards.boards
  );
  return (
    <div className="boards-list">
      {data && data.data.map((card: Board) => <BoardCard card={card} />)}

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
