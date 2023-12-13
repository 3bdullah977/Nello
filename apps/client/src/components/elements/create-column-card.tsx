import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectPic from "./select-pic";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { createCard } from "@/service/card";
import { useParams } from "react-router-dom";
import { DialogClose } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";

function CreateCard({
  refetch,
  columnId,
}: {
  refetch: Function;
  columnId: number;
}) {
  const [pic, setPic] = useState("");
  const [data, setData] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");

  const createColumnCard = async () => {
    await createCard(
      {
        coverImage: pic,
        description: "1",
        title: cardTitle,
      },
      parseInt(boardId!),
      columnId,
      token,
    );

    refetch();
  };

  return (
    <div className="create-card">
      <Card className="min-w-[300px] caret-card-foreground">
        <CardHeader className="  flex items-center ">
          <img src={pic} className="object-cover max-h-72" />
        </CardHeader>
        <CardContent>
          <div className="create-card-input">
            <Input
              className="border  p-5 border-solid border-zinc-400"
              placeholder="Add card title"
              onChange={(e) => {
                setCardTitle(e.target.value);
              }}
            />
          </div>
          <div className="create-cars-btn flex gap-5 mt-2">
            <Dialog>
              <DialogTrigger className="w-full h-full flex ">
                <Button variant="outline" className="w-full  p-5">
                  <Image className="pr-2" />
                  Cover
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Photo search</DialogTitle>
                  <DialogDescription>
                    <SelectPic
                      pic={pic}
                      setPic={setPic}
                      data={data}
                      setData={setData}
                    />
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
        <CardFooter className="gap-5 justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="border p-5 rounded-xl">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className="p-5"
            onClick={() => {
              // saveLocal(pic);
              createColumnCard();
            }}
          >
            <Plus className="pr-2" />
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreateCard;
