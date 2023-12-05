import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
// import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { columns } from "../actions/get-columns-action";
import { boardsID } from "../actions/id-actions";
import { Board } from "@/service/board";
// import img from "../style/pic/WhatsApp Image 2023-10-30 at 20.55.32_75962c28.jpg";

function BoardCard({ card }: { card: Board }) {
  // console.log(card);
  const dispatch: any = useDispatch();
  // useEffect(() => {
  // }, []);
  const id = (e: any) => {
    console.log(e.id);
    dispatch(boardsID(e.id));
    dispatch(columns(e.id));
  };
  return (
    <>
      <Link to={"/home"}>
        <Card className="board-card p-5" onClick={() => id(card)}>
          <CardHeader className="img p-0 h-40">
            <img
              src={card.imageUrl}
              className="rounded-xl object-cover max-h-44"></img>
          </CardHeader>
          <CardContent className="pr-0 pl-0 pt-6">
            <CardTitle>{card.name}</CardTitle>
          </CardContent>
          <CardFooter className="card-footer pb-0 pr-0 pl-0">
            <div className="avatar flex">
              <Avatar className="icon">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="icon">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className="icon">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
}

export default BoardCard;