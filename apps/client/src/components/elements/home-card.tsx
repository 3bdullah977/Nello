import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card as CardType, updateCard } from "@/service/card";
import { useSortable } from "@dnd-kit/sortable";
import {
  SheetContent,
  SheetTitle,
  SheetTrigger,
  Sheet,
  SheetDescription,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getColumnById, getColumns } from "@/service/column";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "../ui/skeleton";
import Editor from "../editor";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "../ui/select";

function CardComponent({
  card,
  setRefetch,
}: {
  card: CardType;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 1rem)`,
        transition,
      }
    : undefined;
  return (
    <Sheet>
      <SheetTrigger className="lg:w-full max-w-[300px]">
        <Card
          className="card p-5"
          // {...attributes}
          // {...listeners}
          // ref={setNodeRef}
          style={style}
        >
          <CardHeader className="img p-0 w-full h-[230px]">
            {!card.coverImage ? (
              <div className="h-full w-full bg-gray-400"></div>
            ) : (
              <img
                src={card.coverImage}
                className="rounded-xl object-cover max-h-44"
              ></img>
            )}
          </CardHeader>
          <div className="lines">
            <div className="line bg-red-600"></div>
            <div className="line bg-cyan-400"></div>
            <div className="line bg-violet-800"></div>
          </div>
          <CardContent className="pr-0 pl-0">
            <CardTitle>{card.title}</CardTitle>
          </CardContent>
        </Card>
      </SheetTrigger>
      <CardPage setRefetch={setRefetch} card={card} />
    </Sheet>
  );
}

function CardPage({
  card,
  setRefetch,
}: {
  card: CardType;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [token] = useLocalStorage("token", "");
  const { boardId } = useParams();
  const [description, setDescription] = useState("");
  const [newColId, setNewCol] = useState(card.columnId);

  const { data, isLoading } = useQuery({
    queryKey: ["cardColumn"],
    queryFn: () => getColumnById(card.columnId, parseInt(boardId!), token),
  });

  const query = useQuery({
    queryKey: ["columns"],
    queryFn: () => getColumns(parseInt(boardId!), token),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await updateCard(
        { description },
        parseInt(boardId!),
        card.columnId,
        card.id,
        token
      );
      setRefetch(true);
      return res;
    },
  });

  const updateColMutation = useMutation({
    mutationKey: ["columns"],
    mutationFn: (newColId: number) => {
      query.refetch();
      return updateCard(
        { columnId: newColId },
        parseInt(boardId!),
        card.columnId,
        card.id,
        token
      );
    },
  });

  return (
    <SheetContent className="w-11/12 h-[90%] rounded-md m-auto" side={"bottom"}>
      {isLoading ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <SheetDescription>Column {data?.data.data.name}</SheetDescription>
      )}
      <ScrollArea className="h-[100%] pr-4 pb-5">
        <div className="sm:flex justify-between mt-5 mb-4 gap-20">
          <div className="sm:w-[50%] overflow-clip max-h-[430px] rounded-md">
            <img src={card.coverImage} alt="cardImage" className="w-full" />
          </div>
          <SheetTitle className="text-3xl sm:text-5xl flex-grow sm:pr-10 sm:mt-0 mt-3">
            <p className="text-right">{card.title}</p>
            <Select onValueChange={(e) => setNewCol(parseInt(e))}>
              <SelectTrigger className="mt-4">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {query.isLoading && updateColMutation.isPending ? (
                    <>loading...</>
                  ) : (
                    query.data?.data.data.map((col) => (
                      <SelectItem
                        value={col.id.toString()}
                      >{`${col.name[0].toUpperCase()}${col.name.slice(
                        1
                      )}`}</SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SheetTitle>
        </div>
        <Editor onChange={setDescription} content={card.description} />
        <div className="w-full flex justify-between mt-2">
          <div></div>
          <Button
            className="w-full sm:w-[100px]"
            onClick={() => {
              mutation.mutate();
              updateColMutation.mutate(newColId);
            }}
          >
            {mutation.isPending ? <Loader /> : <p>Save</p>}
          </Button>
        </div>
      </ScrollArea>
    </SheetContent>
  );
}

export default CardComponent;
