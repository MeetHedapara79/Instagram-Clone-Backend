-- AlterTable
ALTER TABLE `user` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `followers` JSON NOT NULL,
    ADD COLUMN `following` JSON NOT NULL,
    ADD COLUMN `profilePic` VARCHAR(191) NULL;
