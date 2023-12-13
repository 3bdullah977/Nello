import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createColumn } from "@/service/column";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "../ui/use-toast";

function CreateColumn({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [columnName, setColumnName] = useState("");
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");

  const query = useQuery({
    queryKey: ["columns"],
  });

  const { mutate } = useMutation({
    mutationKey: ["columns"],
    mutationFn: () => {
      if (!columnName)
        toast({
          title: "Invalid input",
          description: "column name can not be empty",
        });
      return createColumn({ name: columnName }, parseInt(boardId!), token);
    },
    onSuccess: (data: any) => {
      setOpen(false);
      console.log(data);
      query.refetch();
    },
  });

  return (
    <div className="create-card">
      <Card className="card min-w-[300px] caret-card-foreground">
        <CardContent className="pb-0">
          <div className="create-card-input p-5">
            <Input
              className="border p-5 border-solid border-zinc-400"
              placeholder="Add column title"
              onChange={(e) => {
                setColumnName(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-5 justify-end">
          <DialogClose asChild>
            <Button variant="secondary" className="border p-5 rounded-xl">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="default" className="p-5" onClick={() => mutate()}>
            <Plus className="pr-2" />
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreateColumn;
