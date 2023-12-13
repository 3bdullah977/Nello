import { Drawing, updateDrawing } from "@/service/drawing";
import { Excalidraw } from "@excalidraw/excalidraw";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const DrawingPage = () => {
  const { boardId, drawingId } = useParams();
  const [token] = useLocalStorage("token", "");
  const [drawing, setDrawing] = useLocalStorage("drawing", {} as Drawing);
  const [drawingData, setData] = useState(drawing.content);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      console.log(drawing);
      setDrawing(JSON.parse(drawingData));
      const res = await updateDrawing(
        parseInt(drawingId!),
        boardId!,
        { content: drawingData },
        token
      );

      return res;
    },
  });

  return (
    <div className="h-[900px]">
      <Excalidraw
        initialData={JSON.parse(drawing.content ?? "[]")}
        onChange={(e) => setData(JSON.stringify({ elements: e }))}
        zenModeEnabled={false}
        renderTopRightUI={() => (
          <Button disabled={isPending} onClick={() => mutate()}>
            save
          </Button>
        )}
      />
    </div>
  );
};
export default DrawingPage;
