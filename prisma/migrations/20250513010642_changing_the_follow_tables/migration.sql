/*
  Warnings:

  - You are about to drop the column `profile_id` on the `recomendations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `recomendations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followerId` to the `recomendations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `recomendations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recomendations" DROP CONSTRAINT "recomendations_profile_id_fkey";

-- AlterTable
ALTER TABLE "recomendations" DROP COLUMN "profile_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "followerId" INTEGER NOT NULL,
ADD COLUMN     "followingId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "recomendations_followerId_followingId_key" ON "recomendations"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "recomendations" ADD CONSTRAINT "recomendations_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recomendations" ADD CONSTRAINT "recomendations_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
