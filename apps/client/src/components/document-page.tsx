import { Document, updateDocument } from "@/service/document";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Editor from "./editor";
import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { SheetContent, SheetTitle } from "./ui/sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import { useState } from "react";

type DocumentPageProps = {
  document: Document;
};
export const DocumentPage = ({ document }: DocumentPageProps) => {
  const [content, setContent] = useState("");
  const { boardId } = useParams();
  const [token] = useLocalStorage("token", "");

  const query = useQuery({
    queryKey: ["documents"],
  });

  const mutation = useMutation({
    mutationKey: ["documents"],
    mutationFn: () => updateDocument(document.id, boardId!, { content }, token),
    onSuccess: () => query.refetch(),
  });

  return (
    <SheetContent className="w-11/12 h-[90%] rounded-md m-auto" side={"bottom"}>
      <div className="h-[100%] overflow-scroll mb-16 pr-4 pb-5">
        <div className="sm:flex justify-between mt-5 mb-4 gap-20">
          <SheetTitle className="pl-2 text-3xl sm:text-5xl flex-grow sm:pr-10 sm:mt-0 mt-3">
            <p>{document.name}</p>
          </SheetTitle>
        </div>
        <Editor onChange={setContent} content={document.content} />
        <div className="w-full flex justify-between mt-2">
          <div></div>
          <Button
            className="w-full sm:w-[100px]"
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader /> : <p>Save</p>}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};
