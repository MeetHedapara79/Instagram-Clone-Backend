import { StoryType } from "../generated/prisma";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

export const createStoryService = async (
  userId: string,
  mediaUrl: string,
  caption: string,
  type: StoryType
) => {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return await prisma.story.create({
      data: {
        userId,
        mediaUrl,
        caption,
        type,
        expiresAt,
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const viewStoryService = async (storyId: string, viewerId: string) => {
  try {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new Error("Story not found");
    }

    if (story.expiresAt < new Date()) {
      throw new Error("Story has expired");
    }

    return await prisma.storyView.create({
      data: {
        storyId,
        viewerId,
        viewedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getUserStoriesService = async (userId: string) => {
  try {
    return await prisma.story.findMany({
      where: {
        userId,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        viewers: {
          select: {
            viewer: {
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
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getAllActiveStoriesService = async () => {
    const story =  await prisma.story.findMany({
      where: {
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        // createdAt: 'asc',
        userId: 'asc',
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
    return story;
  };

export const viewerListService = async(storyId:string) => {
  try{
    const list = await prisma.storyView.findMany({
      where:{
        storyId:storyId
      },
      include:{
        viewer:{
          select:{
            id:true,
            username:true,
            profilePic:true,
          },
        },
      },
    });
    return list;
  }
  catch(error){
    console.error(error);
    return;
  }
}