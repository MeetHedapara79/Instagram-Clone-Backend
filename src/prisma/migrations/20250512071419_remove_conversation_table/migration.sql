/*
  Warnings:

  - You are about to drop the `_ConversationParticipants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ConversationParticipants` DROP FOREIGN KEY `_ConversationParticipants_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ConversationParticipants` DROP FOREIGN KEY `_ConversationParticipants_B_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_conversationId_fkey`;

-- DropIndex
DROP INDEX `message_conversationId_fkey` ON `message`;

-- DropTable
DROP TABLE `_ConversationParticipants`;

-- DropTable
DROP TABLE `conversation`;
