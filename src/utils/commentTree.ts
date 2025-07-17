type CommentType = {
  id: string;
  userId: string;
  postId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    profilePic: string | null;
  };
  replies?: CommentType[];
};

export const buildCommentTree = (comments: CommentType[]): CommentType[] => {
  const commentMap = new Map<string, CommentType>();
  const roots: CommentType[] = [];

  for (const comment of comments) {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  }

  for (const comment of comments) {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies!.push(comment);
      }
    } else {
      roots.push(comment);
    }
  }

  return roots;
};
