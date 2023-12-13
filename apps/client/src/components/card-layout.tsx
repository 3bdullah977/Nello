import { Card } from "@/service/card";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

export const CardLayout = ({ card }: { card: Card }) => {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{card.title}</SheetTitle>
      </SheetHeader>
      <div className="p-4"></div>
    </SheetContent>
  );
};
