import { Card, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCard from "./create-column-card";
import { Globe2, Lock, MoreVertical, Plus, Search, Trash } from "lucide-react";
import CreateColumn from "./create-column";
import { ColumnType, getColumns, removeColumn } from "@/service/column";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { Card as CardType, getCards } from "@/service/card";
import { useEffect, useMemo, useState } from "react";
import CardComponent from "./home-card";
import {
  getBoardById,
  listBoardMembers,
  toggleBoardVisibility,
} from "@/service/board";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { User, addUserToBoard, findUsersByName } from "@/service/user";
import { ScrollArea } from "../ui/scroll-area";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "../ui/use-toast";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import { useAtom } from "jotai";
import { columnsAtom } from "@/atoms/columns";

function Board() {
  const [columnId, setColumnId] = useState<number>();
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");
  const [, setColumns] = useAtom(columnsAtom);
  const [userSearch, setUserSearch] = useState("");
  const {
    data,
    isLoading,
    refetch: refetchColumns,
  } = useQuery({
    queryKey: ["columns"],
    queryFn: async () => {
      const data = await getColumns(parseInt(boardId!), token);
      setColumns(data.data.data);
      return data;
    },
  });

  const {
    data: boardData,
    refetch,
    isLoading: isLoading2,
  } = useQuery({
    queryKey: ["board"],
    queryFn: async () => getBoardById(parseInt(boardId!), token),
  });

  const { mutate: mutateVis } = useMutation({
    mutationKey: ["visibility"],
    mutationFn: async () => {
      const res = await toggleBoardVisibility(parseInt(boardId!), token);
      refetch();
      return res;
    },
    onError: (e: any) =>
      toast({ title: "Error modify visibility", description: e.data?.message }),
  });

  const { mutate: mutateDelete } = useMutation({
    mutationKey: ["deleteColumn"],
    mutationFn: async () => {
      await removeColumn(columnId!, parseInt(boardId!), token);
      refetchColumns();
    },
    onError: (e: any) =>
      toast({ title: "Error deleting column", description: e.data?.message }),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["searchUsers", userSearch],
    queryFn: async () => findUsersByName(userSearch, token),
  });

  const { data: boardMembers, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["boardMembers"],
    queryFn: async () => listBoardMembers(parseInt(boardId!), token),
  });

  const onDragEnd = (e: DragEndEvent) => {
    console.log("event", e);
  };

  if (isLoading || isLoading2 || !boardData) return <>loading..</>;
  console.log(boardData.data.data);
  return (
    <>
      <div className="p-5 pb-0 flex justify-between">
        <div className="left flex gap-5 items-center">
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
                <Lock className="pr-2" />
              </div>
            )}
          </button>
          <div className="flex gap-1">
            {!isLoadingMembers &&
              boardMembers?.data.data.map((mem) => <ImageCard user={mem} />)}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"default"} size={"icon"} className="w-6 h-6">
                <Plus size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <h3>Add a member</h3>
              <label htmlFor="search-users">
                <Search size={20} className="ml-2 absolute translate-y-2" />
                <Input
                  name="search-users"
                  className="pl-8"
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </label>
              {!isLoadingUsers && (
                <ScrollArea className="h-56 border rounded-md mt-2 p-2">
                  {users?.data.data.map((user) => (
                    <UserSearchCard user={user} />
                  ))}
                </ScrollArea>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button>
              <MoreVertical />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Board Items</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={`/boards/${boardId}/documents`}>Documents</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className="main p-5 pt-0 mt-2">
          {data &&
            data.data.data.map((column: ColumnType) => (
              <div className="column min-w-[220px] pr-1 design" key={column.id}>
                <Card className="title">
                  <Dialog>
                    <CardHeader className="p-2">
                      <div className="flex justify-between">
                        <p>{column.name}</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={() => setColumnId(column.id)}>
                              <Trash color="red" size={16} />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you sure absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                This action will cause a deletion of this column
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                onClick={() => mutateDelete()}
                                variant={"destructive"}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <DialogTrigger className="w-full" asChild>
                        <Button variant={"outline"} className="w-full">
                          <Plus />
                        </Button>
                      </DialogTrigger>
                    </CardHeader>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create new card</DialogTitle>
                        <DialogDescription>
                          <CreateCard
                            refetch={refetchColumns}
                            columnId={column.id}
                          />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </Card>
                <div>
                  <Column
                    boardId={parseInt(boardId!)}
                    columnId={column.id}
                    key={column.id}
                  />
                </div>
              </div>
            ))}
          <CreateColumnModal />
        </div>
      </DndContext>
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
  const [refetch, setRefetch] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  const getCardsOfColumn = async (columnId: number) => {
    const cards = await getCards(boardId, columnId, token);
    return cards;
  };

  useEffect(() => {
    getCardsOfColumn(columnId).then((data) =>
      setCards(data.data.data as CardType[])
    );
  }, [columnId, refetch]);

  return (
    <div className="flex lg:block pb-12" ref={setNodeRef} style={style}>
      {cards.map((card) => (
        <CardComponent setRefetch={setRefetch} card={card} key={card.id} />
      ))}
    </div>
  );
};

const UserSearchCard = ({ user }: { user: User }) => {
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");

  const query = useQuery({
    queryKey: ["boardMembers"],
  });

  const { mutate } = useMutation({
    mutationKey: ["addUserBoard"],
    mutationFn: () => addUserToBoard(parseInt(boardId!), user.id, token),
    onSuccess: (data) => {
      query.refetch();
      console.log(data);
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="flex gap-2 mt-1 items-center hover:bg-secondary w-full p-1.5 rounded-md"
    >
      <ImageCard user={user} />
      <p>{user.username}</p>
    </button>
  );
};

const ImageCard = ({ user }: { user: User }) => {
  const isUrl = (str: string) =>
    str.match(
      /^(?:http(s)?:\/\/)([\w.-])+(?:[\w.-]+)+([\w-._~:/?#[\]@!$&'()*+,;=.])+$/
    );

  return (
    <div className="w-8 h-8  rounded-sm overflow-clip">
      {!isUrl(user.imageUrl ?? "") ? (
        <div className="w-full h-full bg-indigo-900 text-white flex justify-center items-center font-bold text-2xl">
          {user.username[0]}
        </div>
      ) : (
        <img className="h-full" src={user.imageUrl} alt={user.username} />
      )}
    </div>
  );
};

export default Board;
