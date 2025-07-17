import { PrismaClient } from "../generated/prisma";
import { RegisterUserValidate } from "../validator/auth.validator";
import { translation } from "../language/translation";
import { User } from "../interfaces/user.interface";
const prisma = new PrismaClient();

export const createUser = async (data: RegisterUserValidate) => {
  const { emailphone, password, username, recoveryCode } = data;
  try {
    const createUser = await prisma.user.create({
      data: {
        email_phone: emailphone,
        password: password,
        username: username,
        recoveryCode: recoveryCode ?? null,
      },
    });
    return createUser;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getOneUser = async (data: RegisterUserValidate) => {
  const { emailphone, username } = data;
  try {
    const getUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (getUsername) {
      return {
        userData: getUsername,
        message: translation.USERNAME_ALREADY_EXISTS,
      };
    } else {
      const getUserEmailPhone = await prisma.user.findFirst({
        where: {
          email_phone: emailphone,
        },
      });
      if (getUserEmailPhone) {
        return {
          userData: getUserEmailPhone,
          message: translation.EMAIL_OR_PHONE_ALREADY_EXISTS,
        };
      } else {
        return { userData: null, message: translation.USER_NOT_FOUND };
      }
    }
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getUserById = async (id: string) => {
  try {
    const getUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return getUser;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getByUsername = async (username: string) => {
  try {
    const getUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return getUser;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: {
        followers: true,
        following: true,
      },
    });

    const updateData: any = { ...updates };

    if (updates.followers !== undefined) {
      const newFollowers = Array.isArray(currentUser?.followers)
        ? currentUser?.followers
        : [];

      if (
        typeof updates.followers === "string" ||
        typeof updates.followers === "number"
      ) {
        updateData.followers = [...newFollowers, updates.followers];
      } else if (Array.isArray(updates.followers)) {
        updateData.followers = [...newFollowers, ...updates.followers];
      }
    }

    if (updates.following !== undefined) {
      const newFollowing = Array.isArray(currentUser?.following)
        ? currentUser?.following
        : [];

      if (
        typeof updates.following === "string" ||
        typeof updates.following === "number"
      ) {
        updateData.following = [...newFollowing, updates.following];
      } else if (Array.isArray(updates.following)) {
        updateData.following = [...newFollowing, ...updates.following];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return updatedUser;
  } catch (error) {
    console.error("Update failed:", error);
    return null;
  }
};

export const suggestedUsers = async (userId: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
    });
    return users;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const followUserService = async (
  followerId: string,
  followingId: string
) => {
  try {
    const user = await prisma.notification.create({
      data: {
        followerId: followerId,
        followingId: followingId,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const updateConfirmStatus = async (
  followerId: string,
  followingId: string
) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });

    if (!notification || !notification.id) {
      console.error("Notification not found");
      return null;
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        isConfirmed: true,
      },
    });

    return updatedNotification;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const notificationListService = async (userId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        followingId: userId,
        isConfirmed: false,
      },
    });
    const userIds = notifications.map(
      (notification) => notification.followerId
    );
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
      },
    });

    return users;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const followingListService = async (userId: string) => {
  try {
    const followingList = await prisma.notification.findMany({
      where: {
        followerId: userId,
        isConfirmed: true,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });
    const userIds = followingList.map((notification) => notification.following);
    return userIds;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const followerListService = async (userId: string) => {
  try {
    const followerList = await prisma.notification.findMany({
      where: {
        followingId: userId,
        isConfirmed: true,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });
    const userIds = followerList.map((notification) => notification.follower);
    return userIds;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const searchUsersService = async (query: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        username: { 
          contains: query,
        },
      },
      select: {
        id: true,
        username: true,
        profilePic: true,
        Post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return users;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const tagUserService = async(userIds:string[], postId:string) => {
  try{
    const data = userIds.map((userId) => ({
      userId: userId,
      postId: postId,
    }));
    const tagUser = await prisma.tag.createMany({
      data:data,
    })
    return tagUser;
  } catch (error) {
    console.error(error);
    return;
  } 
}