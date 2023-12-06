import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Globe2, Plus } from "lucide-react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import { createCard } from "@/service/card";
import { useParams } from "react-router-dom";

function CreateCard({ columnId }: { columnId: number }) {
  const [pic, setPic]: any = useState(null);
  const [data, setData]: any = useState(null);
  const [cardDescription, setCardDescription] = useState("");
  const [cardTitle, setCardTitle] = useState("");

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
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");
  const createColumnCard = async () => {
    const data = createCard(
      {
        coverImage: "",
        description: cardDescription,
        title: cardTitle,
      },
      parseInt(boardId!),
      columnId,
      token
    );
    const resolve = await data.data;
    console.log(resolve);
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
              placeholder="Add card title"
              onChange={(e) => {
                setCardTitle(e.target.value);
              }}
            />
          </div>
          <div className="create-card-input mb-6">
            <Input
              className="border  p-5 border-solid border-zinc-400"
              placeholder="Add card description"
              onChange={(e) => {
                setCardDescription(e.target.value);
              }}
            />
          </div>
          <div className="create-cars-btn flex gap-5">
            <Button variant="outline" className="w-full  p-5">
              <Image className="pr-2" />
              <Dialog>
                <DialogTrigger onClick={getData}>Cover</DialogTrigger>
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
            </Button>
            <Button variant="outline" className="w-full  p-5">
              <Globe2 className="pr-2" />
              Public
            </Button>
          </div>
        </CardContent>
        <CardFooter className="gap-5 justify-end">
          <Button variant="blue" className="border p-5 rounded-xl">
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-400 p-5 text-white"
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
