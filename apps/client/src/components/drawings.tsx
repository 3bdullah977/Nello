import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { AddDocument } from "@/service/document";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "./ui/skeleton";
import { formatRelative, subDays } from "date-fns";
import { getUserById } from "@/service/user";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import {
  AddDrawing,
  Drawing,
  createDrawing,
  getDrawings,
} from "@/service/drawing";

export const Drawings = () => {
  const { boardId } = useParams();
  const [page, setPage] = useState(1);
  const [token] = useLocalStorage("token", "");
  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<AddDocument>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["drawings"],
    queryFn: () => getDrawings(parseInt(boardId!), page, 20, token),
  });

  const handleCreateDrawing = async (
    e: FormEvent<HTMLFormElement>,
    data: AddDrawing
  ) => {
    e.preventDefault();
    try {
      await createDrawing(boardId!, data, token);
      refetch();
    } catch (error) {
      toast({
        title: "Error creating drawing",
      });
    }
  };

  return (
    <main className="bg-secondary min-h-screen pt-10">
      <section className="rounded-md w-11/12 min-h-screen bg-background m-auto p-3">
        <div className="flex justify-between mb-4">
          <div />
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="flex items-center">
                <Plus className="pr-2" />
                <p>New Drawing</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={(e) => handleCreateDrawing(e, getValues())}>
                <DialogHeader>
                  <DialogTitle>Create New Drawing</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 mt-4">
                  <Label htmlFor="name" className="">
                    Name
                  </Label>
                  <Input
                    {...register("name")}
                    id="name"
                    className="col-span-3"
                  />
                  <p>
                    {errors.name?.type === "required" &&
                      errors.content?.message}
                  </p>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <LoadingDocuments />
        ) : (
          <Table>
            <TableCaption>A list of your this board drawings.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="text-right">Creator</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-right">Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.data.map((drawing) => (
                <DrawingElement
                  drawing={drawing}
                  creatorId={drawing.creatorId}
                  boardId={boardId!}
                  key={drawing.id}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </main>
  );
};

const DrawingElement = ({
  drawing,
  creatorId,
  boardId,
}: {
  boardId: string;
  drawing: Drawing;
  creatorId: number;
}) => {
  const [token] = useLocalStorage("token", "");
  const [, setDrawing] = useLocalStorage("drawing", {} as Drawing);

  const { data: creatorData, isLoading: isLoadingCreator } = useQuery({
    queryKey: ["creator"],
    queryFn: async () => await getUserById(creatorId, token),
  });

  return (
    <TableRow key={drawing.id}>
      <TableCell className="font-medium min-w-[200px]">
        <Link
          to={`/boards/${boardId}/drawings/${drawing.id}`}
          onClick={() => setDrawing(drawing)}
          className="hover:underline hover:text-primary"
        >
          {drawing.name}
        </Link>
      </TableCell>
      {isLoadingCreator ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <TableCell className="text-right">
          {creatorData?.data.data.username}
        </TableCell>
      )}
      <TableCell className="text-secondary-foreground/65 text-right">
        {formatRelative(subDays(new Date(drawing.createdAt), 0), new Date())}
      </TableCell>
      <TableCell className="text-secondary-foreground/65 text-right">
        {formatRelative(subDays(new Date(drawing.updatedAt), 0), new Date())}
      </TableCell>
    </TableRow>
  );
};

const LoadingDocuments = () => {
  const arr = Array.from({ length: 10 }).map((_, i) => i);
  return (
    <div className="flex flex-col gap-2 items-center mt-4">
      {arr.map(() => (
        <Skeleton className="h-10 rounded-lg w-11/12"></Skeleton>
      ))}
    </div>
  );
};
