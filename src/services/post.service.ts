import { Post } from "../interfaces/user.interface";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const create = async (data: Post) => {
  try {
    const post = await prisma.post.create({
      data: {
        content: data.content,
        location: data.location ?? null,
        caption: data.caption ?? null,
        userId: data.userId,
      },
    });
    return post;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getPostsofFollowingService = async (userIds: Array<string>) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const toggleLikeService = async (postId: string, userId: string) => {
  try {
    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existing) {
      // Unlike
      await prisma.postLike.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: { likes: { decrement: 1 } },
      });

      return { liked: false };
    } else {
      // Like
      await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });

      await prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
      });

      return { liked: true };
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export const likeDataListService = async (userId: string) => {
  try {
    const likeList = await prisma.postLike.findMany({
      where: {
        userId: userId,
      },
    });
    return likeList;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const likedPostByUserService = async (postId: string) => {
  try {
    const userIds = await prisma.postLike.findMany({
      where: {
        postId: postId,
      },
    });
    const userIdList = userIds.map((user) => user.userId);
    const likedUserList = await prisma.user.findMany({
      where: {
        id: { in: userIdList },
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
      },
    });
    return likedUserList;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const createCommentService = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        userId,
        postId,
        content,
        parentId: parentId ?? null,
      },
    });
    return newComment;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getAllCommentsService = async (postId: string) => {
  try {
    const getComments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
        post: {
          select: {
            id: true,
            likes: true,
            content: true,
            userId: true,
            caption: true,
          },
        },
      },
    });
    return getComments;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getPostByPostIdService = async (postId: string) => {
  try {
    const getPostDetails = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    return getPostDetails;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getTagedPostService = async (userId: string) => {
  try {
    const getTagedPosts = await prisma.tag.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            likes: true,
            user: {
              select: {
                id: true,
                username: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });
    return getTagedPosts;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getTagedPostsByPostIdService = async (postId: string) => {
  try {
    const getTagedPosts = await prisma.tag.findMany({
      where: {
        postId: postId,
      },
      select: {
        userId: true,
        postId: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });
    return getTagedPosts;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getAllTagedPostsService = async() => {
  try{
    const getTagedPosts = await prisma.tag.findMany({
      select:{
        postId:true,
      },
      distinct:"postId"
    })
    const postIds = getTagedPosts.map(post => post.postId)
    return postIds;
  } catch (error) {
    console.error(error);
    return;
  }
}
