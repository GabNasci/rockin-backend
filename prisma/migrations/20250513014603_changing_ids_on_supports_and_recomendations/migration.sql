/*
  Warnings:

  - The primary key for the `recomendations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `recomendations` table. All the data in the column will be lost.
  - The primary key for the `supports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `supports` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "recomendations_followerId_followingId_key";

-- AlterTable
ALTER TABLE "recomendations" DROP CONSTRAINT "recomendations_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "recomendations_pkey" PRIMARY KEY ("followerId", "followingId");

-- AlterTable
ALTER TABLE "supports" DROP CONSTRAINT "supports_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "supports_pkey" PRIMARY KEY ("post_id", "profile_id");
