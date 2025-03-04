/*
  Warnings:

  - You are about to drop the `musician_genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "musician_genres" DROP CONSTRAINT "musician_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "musician_genres" DROP CONSTRAINT "musician_genres_profile_id_fkey";

-- DropTable
DROP TABLE "musician_genres";

-- CreateTable
CREATE TABLE "_GenreToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GenreToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GenreToProfile_B_index" ON "_GenreToProfile"("B");

-- AddForeignKey
ALTER TABLE "_GenreToProfile" ADD CONSTRAINT "_GenreToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToProfile" ADD CONSTRAINT "_GenreToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
