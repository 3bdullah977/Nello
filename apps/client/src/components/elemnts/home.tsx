import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCard from "./create-column-card";
import { Globe2, Lock } from "lucide-react";
import CreateColumn from "./creat-column";
import { ColumnType, getColumns } from "@/service/column";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { Card as CardType, getCards } from "@/service/card";
import { useEffect, useState } from "react";
import CardComponent from "./home-card";
import { getBoardById, toggleBoardVisibility } from "@/service/board";

function Board() {
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");
  const { data, isLoading } = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(parseInt(boardId!), token!),
  });

  const { data: boardData, isLoading: isLoading2 } = useQuery({
    queryKey: ["board"],
    queryFn: async () => getBoardById(parseInt(boardId!), token!),
  });

  const { mutate: mutateVis } = useMutation({
    mutationKey: ["visibility", "board"],
    mutationFn: async () => toggleBoardVisibility(parseInt(boardId!), token!),
  });

  if (isLoading || isLoading2 || !boardData) return <>loading..</>;
  return (
    <>
      <div className="user p-5 pb-0 flex justify-between">
        <div className="left flex gap-24">
          <p className="text-slate-900">{boardData!.data.data.name}</p>
          <button className="flex" onClick={() => mutateVis()}>
            {!boardData!.data.data.isPrivate ? (
              <div className="flex gap-4">
                public
                <Globe2 className="pr-2" />
              </div>
            ) : (
              <div className="flex gap-4">
                private
                <Lock />
              </div>
            )}
          </button>
        </div>
      </div>
      <div className="main p-5 pt-0">
        {data &&
          data.data.data.map((column: ColumnType) => (
            <div className="column min-w-[220px] design" key={column.id}>
              <Card className="title">
                <CardHeader className="p-2">
                  <p>{column.name}</p>
                </CardHeader>
              </Card>
              <div>
                <Column
                  boardId={parseInt(boardId!)}
                  columnId={column.id}
                  key={column.id}
                />
              </div>
              <Card className="card border border-dashed">
                <CardHeader className="add-card flex items-center">
                  <Dialog>
                    <DialogTrigger
                      className="p-6 max-h-[120px]"
                      value={"design"}
                    >
                      + Add new card
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create new card</DialogTitle>
                        <DialogDescription>
                          <CreateCard columnId={column.id} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
              </Card>
            </div>
          ))}
        <CreateColumnModal />
      </div>
    </>
  );
}

const CreateColumnModal = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="column min-w-[220px] h-full">
      <Card className="card border border-dashed">
        <CardHeader className="add-card flex items-center">
          <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger className="p-6" value={"design"}>
              + Add new Column
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new Column</DialogTitle>
                <DialogDescription>
                  <CreateColumn setOpen={setOpen} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </div>
  );
};

const Column = ({
  columnId,
  boardId,
}: {
  columnId: number;
  boardId: number;
}) => {
  const [token] = useLocalStorage("token", "");
  const [cards, setCards] = useState<CardType[]>([]);

  const getCardsOfColumn = async (columnId: number) => {
    const cards = await getCards(boardId, columnId, token);
    return cards;
  };

  useEffect(() => {
    getCardsOfColumn(columnId).then((data) =>
      setCards(data.data.data as CardType[]),
    );
  }, [columnId]);

  return (
    <div>
      {cards.map((card) => (
        <CardComponent card={card} key={card.id} />
      ))}
    </div>
  );
};

export default Board;
