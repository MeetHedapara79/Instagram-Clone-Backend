/*
  Warnings:

  - The primary key for the `conversation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_ConversationParticipants` DROP FOREIGN KEY `_ConversationParticipants_A_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_conversationId_fkey`;

-- DropIndex
DROP INDEX `message_conversationId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `_ConversationParticipants` MODIFY `A` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `conversation` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `message` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `conversationId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConversationParticipants` ADD CONSTRAINT `_ConversationParticipants_A_fkey` FOREIGN KEY (`A`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
