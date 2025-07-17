import { PrismaClient } from "../generated/prisma";
import { translation } from "../language/translation";
const prisma = new PrismaClient();

export const findConversationIdSevice = async (ids: string[]) => {
  try {
    const conversation_id = await prisma.message.findFirst({
      where: {
        conversationId: { in: ids },
      },
    });
    return conversation_id;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const createMessageService = async (
  senderId: string,
  receiverId: string,
  content: string,
  postId:string
) => {
  try {
    const participantIds = [senderId, receiverId];
    if (participantIds) {
      const newId1 = `${participantIds[0]}_${participantIds[1]}`;
      const newId2 = `${participantIds[1]}_${participantIds[0]}`;
      const existingConversationId = await findConversationIdSevice([
        newId1,
        newId2,
      ]);
      if (existingConversationId) {
        let newConversationId = existingConversationId.conversationId;
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content,
            conversationId: newConversationId,
            timestamp: new Date(),
            readStatus: false,
            postId: postId
          },
        });
        return newMessage;
      } else {
        let newConversationId = newId1;
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content,
            conversationId: newConversationId,
            timestamp: new Date(),
            readStatus: false,
            postId:postId
          },
        });
        return newMessage;
      }
    } else {
      return { message: translation.USER_NOT_FOUND };
    }
  } catch (error) {
    console.error("Error creating message:", error);
    throw new Error("Error creating message");
  }
};

export const findConversationIdService = async (ids: string[]) => {
  try {
    const newId1 = `${ids[0]}_${ids[1]}`;
    const newId2 = `${ids[1]}_${ids[0]}`;
    const conversationId = await prisma.message.findFirst({
      where: {
        OR: [{ conversationId: newId1 }, { conversationId: newId2 }],
      },
    });
    if (conversationId) {
      return conversationId.conversationId;
    } else {
      return newId1;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getMessagesSrvices = async (ids: string[]) => {
  try {
    const newId1 = `${ids[0]}_${ids[1]}`;
    const newId2 = `${ids[1]}_${ids[0]}`;
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ conversationId: newId1 }, { conversationId: newId2 }],
      },
      orderBy:{
        timestamp:"asc"
      }
    });

    return messages;
  } catch (error) {
    console.error(error);
    return;
  }
};
