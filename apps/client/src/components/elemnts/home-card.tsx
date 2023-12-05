import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import img from '../style/WhatsApp Image 2023-10-30 at 16.39.29_00783bfd.jpg'
import { Heart, Paperclip, MessageSquare } from "lucide-react";
import { Card as CardType } from "@/service/card";

function CardComponent({ card }: { card: CardType }) {
  return (
    <>
      <Card className="card  p-5">
        <CardHeader className="img p-0">
          <img
            src={card.coverImage}
            className="rounded-xl object-cover max-h-44"></img>
        </CardHeader>
        <div className="lines">
          <div className="line bg-red-600"></div>
          <div className="line bg-cyan-400"></div>
          <div className="line bg-violet-800"></div>
        </div>
        <CardContent className="pr-0 pl-0">
          <CardTitle>Types of paper catalog printing</CardTitle>
          <CardDescription className="pt-2">{card.description}</CardDescription>
        </CardContent>
        <CardFooter className="card-footer pb-0 pr-0 pl-0">
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
          </div>
          <div className="social">
            <div className="element flex text-muted-foreground items-center gap-1">
              <p>65</p>
              <MessageSquare size={15} />
            </div>
            <div className="element flex text-muted-foreground items-center gap-1">
              <p>36</p>
              <Heart size={15} />
            </div>
            <div className="element flex text-muted-foreground items-center gap-1">
              <p>59</p>
              <Paperclip size={15} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default CardComponent;
