import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Globe2, Plus, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectPic from "./select-pic";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBoard } from "@/service/board";
import { useLocalStorage } from "usehooks-ts";
import { User } from "@/service/user";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "../ui/use-toast";

function CreateBoardCard({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [pic, setPic] = useState("");
  const [data, setData] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [title, setTitle] = useState("");
  const [token] = useLocalStorage("token", "");
  const [user] = useLocalStorage("user", {} as User);

  const query = useQuery({
    queryKey: ["boards"],
  });

  const { mutate, data: mutateData } = useMutation({
    mutationKey: ["createBoard"],
    mutationFn: async () => {
      const data = await createBoard(
        {
          creatorId: user.id,
          imageUrl: pic,
          isPrivate,
          name: title,
        },
        token
      );
      query.refetch();
      setOpen(false);
      return data;
    },
    onError: (e: any) =>
      toast({
        title: "Error creating board",
        description: e.response?.data.message,
      }),
  });

  const getData = async () => {
    const dataFetch = await axios.get(
      "https://api.pexels.com/v1/curated?per_page=15&page=1",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            "563492ad6f91700001000001c84723fce83d46c993eddb350985e0bc",
        },
      }
    );
    setData(dataFetch.data.photos);
  };

  const createBoardCard = async () => {
    mutate();
  };

  return (
    <div className="create-card">
      <Card className="card min-w-[300px] caret-card-foreground">
        <CardHeader className="  flex items-center ">
          <img src={pic} className="object-cover max-h-72" />
        </CardHeader>
        <CardContent>
          <div className="create-card-input mb-6">
            <Input
              className="border  p-5 border-solid border-zinc-400"
              placeholder="Add border title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="create-cars-btn flex gap-5">
            <Dialog>
              <DialogTrigger onClick={getData} className="w-full">
                <Button variant="outline" className="w-full p-5">
                  <Image className="pr-2" />
                  Cover
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
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button
              variant="outline"
              className="w-full p-5"
              onClick={() => setIsPrivate((prev) => !prev)}
            >
              {!isPrivate ? (
                <>
                  <Globe2 className="pr-2" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="pr-2" />
                  Private
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="gap-5 justify-end">
          <DialogClose asChild>
            <Button variant="blue" className="border p-5 rounded-xl">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="outline"
            className="bg-zinc-400 p-5 text-white"
            onClick={createBoardCard}
          >
            <Plus className="pr-2" />
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreateBoardCard;
