-- AlterTable
ALTER TABLE `message` ADD COLUMN `postId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
