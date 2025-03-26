import { formatCommentDate } from "@/helpers/common";
import { LifetimeItem } from "@/store/activeTask.slice";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";

interface TaskCommentProps {
  comment: LifetimeItem;
}

export default function TaskComment({ comment }: TaskCommentProps) {
  return (
    <Card
      key={comment.id}
      sx={{
        backgroundColor: "#f0f9ff",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader
        avatar={<Avatar></Avatar>}
        title={`${comment.userName}`}
        subheader={`${formatCommentDate(comment.createdAt)}`}
      />
      <CardContent>
        <Typography gutterBottom>{comment.comment}</Typography>
      </CardContent>
    </Card>
  );
}
