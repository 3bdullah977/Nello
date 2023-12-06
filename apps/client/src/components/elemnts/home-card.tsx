import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import img from '../style/WhatsApp Image 2023-10-30 at 16.39.29_00783bfd.jpg'
import { Card as CardType } from "@/service/card";

function CardComponent({ card }: { card: CardType }) {
  return (
    <>
      <Card className="card  p-5">
        <CardHeader className="img p-0 w-full h-[230px]">
          {!card.coverImage ? (
            <div className="h-full w-full bg-gray-400"></div>
          ) : (
            <img
              src={card.coverImage}
              className="rounded-xl object-cover max-h-44"
            ></img>
          )}
        </CardHeader>
        <div className="lines">
          <div className="line bg-red-600"></div>
          <div className="line bg-cyan-400"></div>
          <div className="line bg-violet-800"></div>
        </div>
        <CardContent className="pr-0 pl-0">
          <CardTitle>{card.title}</CardTitle>
          <CardDescription className="pt-2">{card.description}</CardDescription>
        </CardContent>
      </Card>
    </>
  );
}

export default CardComponent;
