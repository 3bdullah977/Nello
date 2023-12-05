import { Card, CardHeader } from "@/components/ui/card";
import CardComponent from "./home-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateCard from "./create-column-card";
import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateColumn from "./creat-column";
// import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { columnsID } from "../actions/id-actions";
import { cards } from "../actions/get-cards-action";
import { Column } from "@/service/column";
import { Card as CardType } from "@/service/card";
// type MainProps = {
//   design: {
//     cover: string;
//   };
//   prototipp: {
//     cover: string;
//   };
//   test: {
//     cover: string;
//   };
//   trello: {
//     cover: string;
//   };
//   final: {
//     cover: string;
//   };
// };

function Board() {
  // const [columnId, setColumnId] = useState(0);
  // const [cardsData, setCardsData] = useState({});
  // console.log(cardsData);
  const design = () => {
    let items;
    if (localStorage.getItem(`design`) === null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem(`design`) ?? "");
    }
    // localStorage.clear();
    return items;
  };

  // const getBoard = async (id) => {
  //   let token;
  //   if (sessionStorage.getItem("token") === null) {
  //     token = [];
  //   } else {
  //     token = JSON.parse(sessionStorage.getItem("token"));
  //   }
  //   const dataFetch = await axios.get(
  //     `http://localhost:3001/api/v1/boards/${boards_id}/columns/${id}/cards?page=1&limit=15`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   const resolve = await dataFetch.data.data;
  //   setCardsData(resolve);
  //   // console.log(resolve);
  // };

  // useEffect(() => {}, [columnId]);

  // console.log(design());
  // const prototipp = () => {
  //   let items;
  //   if (localStorage.getItem(`prototipp`) === null) {
  //     items = [];
  //   } else {
  //     items = JSON.parse(localStorage.getItem(`prototipp`));
  //   }
  //   // localStorage.clear();
  //   return items;
  // };
  // const test = () => {
  //   let items;
  //   if (localStorage.getItem(`test`) === null) {
  //     items = [];
  //   } else {
  //     items = JSON.parse(localStorage.getItem(`test`));
  //   }
  //   // localStorage.clear();
  //   return items;
  // };
  // const trello = () => {
  //   let items;
  //   if (localStorage.getItem(`trello`) === null) {
  //     items = [];
  //   } else {
  //     items = JSON.parse(localStorage.getItem(`trello`));
  //   }
  //   // localStorage.clear();
  //   return items;
  // };
  // const final = () => {
  //   let items;
  //   if (localStorage.getItem(`final`) === null) {
  //     items = [];
  //   } else {
  //     items = JSON.parse(localStorage.getItem(`final`));
  //   }
  //   // localStorage.clear();
  //   return items;
  // };

  // const [col, setColumns] = useState(null);

  // const getColumns = async () => {
  //   let token;
  //   if (sessionStorage.getItem("token") === null) {
  //     token = [];
  //   } else {
  //     token = JSON.parse(sessionStorage.getItem("token"));
  //   }
  //   const dataFetch = await axios.get(
  //     "http://localhost:3001/api/v1/boards/13/columns?page=1&limit=15",
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   const resolve = await dataFetch.data.data;
  //   // console.log(resolve);
  //   setColumns(resolve);
  // };
  // console.log(boards);
  // const dispatch = useDispatch();
  // const { boards_id } = useSelector((state) => state.id);
  // useEffect(() => {
  //   dispatch(cards(columnId, boards_id));
  // }, []);
  const { data } = useSelector(
    (state: {
      columns: {
        columns: { data: any; message: string; statusCode: number };
      };
    }) => state.columns.columns
  );
  const dispatch: any = useDispatch();
  const id = (id: number) => {
    dispatch(columnsID(id));
  };
  // console.log(data);
  return (
    <>
      <div className="user p-5 pb-0 flex justify-between">
        <div className="left flex gap-24">
          <p>Brackets</p>
          <h3 className="flex">
            <Globe2 className="pr-2" />
            Public
          </h3>
        </div>
        <div className="right">
          <div className="avatar flex">
            <Avatar className="icon">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="icon">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="icon">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="icon">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>+</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="main p-5 pt-0">
        {data &&
          data.data.map((column: Column) => (
            <div className="column min-w-[220px] design">
              <Card className="title">
                <CardHeader className="p-2">
                  <p>{column.name}</p>
                </CardHeader>
              </Card>
              {/* {console.log(column.id)} */}
              {design().map((card: CardType) => (
                <CardComponent key={card.id} card={card} />
              ))}
              <Card className="card border border-dashed">
                <CardHeader className="add-card flex items-center">
                  <Dialog>
                    <DialogTrigger
                      className="p-6"
                      value={"design"}
                      onClick={() => {
                        // setColumnId(column.id);
                        id(column.id);
                      }}>
                      + Add new card
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create new card</DialogTitle>
                        <DialogDescription>
                          <CreateCard />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
              </Card>
            </div>
          ))}

        <div className="column min-w-[220px] h-full">
          <Card className="card border border-dashed">
            <CardHeader className="add-card flex items-center">
              <Dialog>
                <DialogTrigger className="p-6 " value={"design"}>
                  + Add new Column
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new Column</DialogTitle>
                    <DialogDescription>
                      <CreateColumn />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </div>
        {/* <div className="column min-w-[220px] prototipp">
          <Card className="title">
            <CardHeader className="p-2">
              <p>Prototipp</p>
            </CardHeader>
          </Card>
          {prototipp().map((card: any) => (
            <CardComponent key={card} card={card} />
          ))}
          <Card className="card border border-dashed mt-5">
            <CardHeader className="add-card flex items-center">
              <Dialog>
                <DialogTrigger
                  className="p-6"
                  value={"prototipp"}
                  onClick={(e: any) => {
                    setCloumnValue(e.target.value);
                  }}>
                  + Add new card
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new card</DialogTitle>
                    <DialogDescription>
                      <CreateCard columnValue={columnValue} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </div>
        <div className="column min-w-[220px] test">
          <Card className="title">
            <CardHeader className="p-2">
              <p>Test</p>
            </CardHeader>
          </Card>
          {test().map((card: any) => (
            <CardComponent key={card} card={card} />
          ))}
          <Card className="card border border-dashed mt-5">
            <CardHeader className="add-card flex items-center">
              <Dialog>
                <DialogTrigger
                  className="p-6"
                  value={"test"}
                  onClick={(e: any) => {
                    setCloumnValue(e.target.value);
                  }}>
                  + Add new card
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new card</DialogTitle>
                    <DialogDescription>
                      <CreateCard columnValue={columnValue} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </div>
        <div className="column min-w-[220px] trello">
          <Card className="title">
            <CardHeader className="p-2">
              <p>Trello</p>
            </CardHeader>
          </Card>
          {trello().map((card: any) => (
            <CardComponent key={card} card={card} />
          ))}
          <Card className="card border border-dashed mt-5">
            <CardHeader className="add-card flex items-center">
              <Dialog>
                <DialogTrigger
                  className="p-6"
                  value={"trello"}
                  onClick={(e: any) => {
                    setCloumnValue(e.target.value);
                  }}>
                  + Add new card
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new card</DialogTitle>
                    <DialogDescription>
                      <CreateCard columnValue={columnValue} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </div>
        <div className="column min-w-[220px] final">
          <Card className="title">
            <CardHeader className="p-2">
              <p>Final</p>
            </CardHeader>
          </Card>
          {final().map((card: any) => (
            <CardComponent key={card} card={card} />
          ))}
          <Card className="card border border-dashed mt-5">
            <CardHeader className="add-card flex items-center">
              <Dialog>
                <DialogTrigger
                  className="p-6"
                  value={"final"}
                  onClick={(e: any) => {
                    setCloumnValue(e.target.value);
                  }}>
                  + Add new card
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create new card</DialogTitle>
                    <DialogDescription>
                      <CreateCard columnValue={columnValue} />
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        </div> */}
      </div>
    </>
  );
}

export default Board;
