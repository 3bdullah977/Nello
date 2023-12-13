import {
  Card,
  CardContent,
  // CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import Final from "./final";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
// import React from "react";
// import { useNavigate } from "react-router-dom";

type SelectPicProps = {
  pic: string;
  setPic: React.Dispatch<React.SetStateAction<string>>;
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
};
function SelectPic({ pic, setPic, data, setData }: SelectPicProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState();

  const click = (e: any) => {
    setPic(e.target.src);
    // history();
  };
  const searchInput = (e: any) => {
    setInputValue(e.target.value);
  };
  const sumbmitSearch = async () => {
    const dataFetch = await axios.get(
      inputValue
        ? `https://api.pexels.com/v1/search?query=${inputValue}+query&per_page=15&page=1`
        : "https://api.pexels.com/v1/search?query=all&per_page=15&page=1",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization:
            "563492ad6f91700001000001c84723fce83d46c993eddb350985e0bc",
        },
      },
    );
    setData(dataFetch.data.photos);
  };

  useEffect(() => {
    setIsLoading(true);
    sumbmitSearch().then(() => setIsLoading(false));
  }, [inputValue]);

  return (
    <div className="create-card">
      <Card className="card min-w-[300px] caret-card-foreground border-none">
        {/* <CardHeader>
                Photo search
            </CardHeader> */}
        <CardContent>
          <div className="search-pics-input mb-6">
            <label htmlFor="">
              <Search
                size={20}
                className="ml-2 absolute translate-y-2.5 right-14 cursor-pointer"
                onClick={sumbmitSearch}
              />
              <Input
                className="border p-5 border-solid border-zinc-400"
                placeholder="Keywords..."
                onChange={searchInput}
              />
            </label>
          </div>
          <div className="pics flex gap-5 h-96 overflow-y-scroll">
            {isLoading && <Skeleton className="w-full h-96"></Skeleton>}
            <ul className="gallery">
              {data &&
                data.map((card: any) => (
                  <li key={card.src}>
                    <img
                      className="rounded"
                      onClick={click}
                      src={card.src.large}
                    />
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SelectPic;
