/*
  Warnings:

  - Made the column `cuid` on table `Chat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cuid` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "cuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "cuid" SET NOT NULL;
