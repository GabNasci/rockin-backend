/*
  Warnings:

  - You are about to drop the `_bands_genres` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `bands` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_id` to the `bands` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_bands_genres" DROP CONSTRAINT "_bands_genres_A_fkey";

-- DropForeignKey
ALTER TABLE "_bands_genres" DROP CONSTRAINT "_bands_genres_B_fkey";

-- AlterTable
ALTER TABLE "bands" ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_bands_genres";

-- CreateIndex
CREATE UNIQUE INDEX "bands_owner_id_key" ON "bands"("owner_id");

-- AddForeignKey
ALTER TABLE "bands" ADD CONSTRAINT "bands_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
