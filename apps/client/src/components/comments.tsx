import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AddComment,
  Comment,
  createComment,
  getComments,
} from "@/service/comment";
import { FormEvent, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { User, getUserById } from "@/service/user";
import { formatRelative, subDays } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";

type CommentsProps = {
  cardId: number;
};

const Comments = ({ cardId }: CommentsProps) => {
  const [page, setPage] = useState(1);
  const [token] = useLocalStorage("token", "");

  const { getValues, register } = useForm<AddComment>();

  const commentsQuery = useQuery({
    queryKey: [`comments${cardId}`],
    queryFn: async () => {
      const data = await getComments(cardId, page, 50, token);
      return data;
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: () => createComment(cardId, getValues(), token),
    onSuccess: () => commentsQuery.refetch(),
  });

  const handlePost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCommentMutation.mutate();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Comments</DialogTitle>
        <div className="h-[600px] overflow-scroll">
          {commentsQuery.isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : commentsQuery.data?.data.data.length === 0 ? (
            <div className="flex justify-center items-center font-bold h-72 text-xl opacity-30">
              No Comments
            </div>
          ) : (
            commentsQuery.data?.data.data.map((comment) => (
              <CommentComponent comment={comment} />
            ))
          )}
        </div>
      </DialogHeader>
      <DialogFooter>
        <form noValidate className="w-full" onSubmit={handlePost}>
          <div className="flex w-full gap-1.5">
            <Input
              type="text"
              id="comment"
              placeholder="Type in your comment.."
              {...register("content")}
            />
            <Button>Post</Button>
          </div>
        </form>
      </DialogFooter>
    </DialogContent>
  );
};

type CommentComponentProps = {
  comment: Comment;
};

const CommentComponent = ({ comment }: CommentComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [creator, setCreator] = useState({} as User);
  const [token] = useLocalStorage("token", "");

  useEffect(() => {
    getUserById(comment.userId, token).then((data) =>
      setCreator(data.data.data)
    );
    setIsLoading(false);
  }, []);

  return (
    <div className="flex gap-2 my-4">
      <Avatar>
        <AvatarImage src={creator.imageUrl} alt={creator.username} />
        <AvatarFallback className="bg-indigo-900">
          {creator.username?.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              creator.username
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">{comment.content}</CardContent>
        <CardFooter className="text-gray-700 text-sm flex justify-between">
          <div />
          {formatRelative(subDays(new Date(comment.updatedAt), 0), new Date())}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Comments;
