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
import { AddDocument, Document, getDocuments } from "@/service/document";
import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "./ui/skeleton";
import { formatRelative, subDays } from "date-fns";
import { getUserById } from "@/service/user";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { DocumentPage } from "./document-page";
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
import { createDocument } from "@/service/document";
import { toast } from "./ui/use-toast";

export const Documents = () => {
  const { boardId } = useParams();
  const [page, setPage] = useState(1);
  const [token] = useLocalStorage("token", "");
  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<AddDocument>();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: () => getDocuments(parseInt(boardId!), page, 20, token),
  });

  const handleCreateDocument = async (
    e: FormEvent<HTMLFormElement>,
    data: AddDocument
  ) => {
    e.preventDefault();
    try {
      await createDocument(boardId!, data, token);
      refetch();
    } catch (error) {
      toast({
        title: "Error creating document",
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
                <p>New Document</p>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={(e) => handleCreateDocument(e, getValues())}>
                <DialogHeader>
                  <DialogTitle>Create New Document</DialogTitle>
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
            <TableCaption>A list of your this board documents.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="text-right">Creator</TableHead>
                <TableHead className="text-right">Created At</TableHead>
                <TableHead className="text-right">Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.data.map((document) => (
                <Sheet key={document.id}>
                  <DocumentElement
                    document={document}
                    creatorId={document.creatorId}
                    boardId={boardId!}
                    key={document.id}
                  />
                  <DocumentPage document={document} />
                </Sheet>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </main>
  );
};

const DocumentElement = ({
  document,
  creatorId,
}: {
  boardId: string;
  document: Document;
  creatorId: number;
}) => {
  const [token] = useLocalStorage("token", "");

  const { data: creatorData, isLoading: isLoadingCreator } = useQuery({
    queryKey: ["creator"],
    queryFn: async () => await getUserById(creatorId, token),
  });

  return (
    <TableRow key={document.id}>
      <TableCell className="font-medium min-w-[200px]">
        <SheetTrigger className="hover:underline hover:text-primary">
          {document.name}
        </SheetTrigger>
      </TableCell>
      {isLoadingCreator ? (
        <Skeleton className="w-full h-10" />
      ) : (
        <TableCell className="text-right">
          {creatorData?.data.data.username}
        </TableCell>
      )}
      <TableCell className="text-secondary-foreground/65 text-right">
        {formatRelative(subDays(new Date(document.createdAt), 0), new Date())}
      </TableCell>
      <TableCell className="text-secondary-foreground/65 text-right">
        {formatRelative(subDays(new Date(document.updatedAt), 0), new Date())}
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
