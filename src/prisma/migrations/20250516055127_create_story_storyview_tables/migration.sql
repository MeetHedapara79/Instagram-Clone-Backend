-- CreateTable
CREATE TABLE `story` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `mediaUrl` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `type` ENUM('IMAGE', 'VIDEO') NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `story_view` (
    `storyId` VARCHAR(191) NOT NULL,
    `viewerId` VARCHAR(191) NOT NULL,
    `viewedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`storyId`, `viewerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `story` ADD CONSTRAINT `story_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_view` ADD CONSTRAINT `story_view_storyId_fkey` FOREIGN KEY (`storyId`) REFERENCES `story`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `story_view` ADD CONSTRAINT `story_view_viewerId_fkey` FOREIGN KEY (`viewerId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
