import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// type CreateCardProps = {
//   columnValue: string;
// };

function CreateColumn() {
  const [CardDescription, setCardDescription] = useState("");
  const { boards_id } = useSelector(
    (state: { id: { boards_id: number } }) => state.id
  );

  const createBoardColumn = async () => {
    let token;
    if (sessionStorage.getItem("token") === null) {
      token = [];
    } else {
      token = JSON.parse(sessionStorage.getItem("token") ?? "");
    }
    console.log(token);
    console.log(`${boards_id}hhhhh`);
    const data = await axios.post(
      `http://localhost:3001/api/v1/boards/${boards_id}/columns`,
      {
        name: CardDescription,
        position: 0,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resolve = await data.data;
    console.log(resolve);
  };

  return (
    <div className="create-card">
      <Card className="card min-w-[300px] caret-card-foreground">
        <CardContent className="pb-0">
          <div className="create-card-input p-5">
            <Input
              className="border p-5 border-solid border-zinc-400"
              placeholder="Add column title"
              onChange={(e) => {
                setCardDescription(e.target.value);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="gap-5 justify-end">
          <Button variant="blue" className="border p-5 rounded-xl">
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-400 p-5 text-white"
            onClick={createBoardColumn}>
            <Plus className="pr-2" />
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreateColumn;
