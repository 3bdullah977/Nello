import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { columns } from "../actions/get-columns-action";
import { boardsID } from "../actions/id-actions";
import { Board, listBoardMembers } from "@/service/board";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { User } from "@/service/user";

function BoardCard({ card }: { card: Board }) {
  const [token] = useLocalStorage("token", "");
  const [members, setMembers] = useState<User[]>([]);
  const dispatch: any = useDispatch();
  const id = (e: any) => {
    dispatch(boardsID(e.id));
    dispatch(columns(e.id, token));
  };

  useEffect(() => {
    listBoardMembers(card.id, token).then((data) => setMembers(data.data.data));
  }, [card, token]);

  return (
    <>
      <Link to={`/boards/${card.id}`}>
        <Card className="board-card p-5" onClick={() => id(card)}>
          <CardHeader className="img p-0 h-40">
            <img
              src={card.imageUrl}
              className="rounded-xl object-cover max-h-44 h-full"
            ></img>
          </CardHeader>
          <CardContent className="pr-0 pl-0 pt-6">
            <CardTitle>{card.name}</CardTitle>
          </CardContent>
          <CardFooter className="card-footer pb-0 pr-0 pl-0">
            <div className="avatar flex overflow-ellipsis w-full">
              {members.map(
                (member, i) =>
                  !(i >= 3) && (
                    <Avatar className="icon" key={member.id}>
                      <AvatarImage src={member.imageUrl} />
                      <AvatarFallback>{member.username}</AvatarFallback>
                    </Avatar>
                  )
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
}

export default BoardCard;
