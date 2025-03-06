/*
  Warnings:

  - You are about to drop the `_BandMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BandToGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfileToSpeciality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TaggedPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BandMembers" DROP CONSTRAINT "_BandMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_BandMembers" DROP CONSTRAINT "_BandMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_BandToGenre" DROP CONSTRAINT "_BandToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_BandToGenre" DROP CONSTRAINT "_BandToGenre_B_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToProfile" DROP CONSTRAINT "_ConversationToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToProfile" DROP CONSTRAINT "_ConversationToProfile_B_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToProfile" DROP CONSTRAINT "_GenreToProfile_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToProfile" DROP CONSTRAINT "_GenreToProfile_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileToSpeciality" DROP CONSTRAINT "_ProfileToSpeciality_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileToSpeciality" DROP CONSTRAINT "_ProfileToSpeciality_B_fkey";

-- DropForeignKey
ALTER TABLE "_TaggedPosts" DROP CONSTRAINT "_TaggedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaggedPosts" DROP CONSTRAINT "_TaggedPosts_B_fkey";

-- DropTable
DROP TABLE "_BandMembers";

-- DropTable
DROP TABLE "_BandToGenre";

-- DropTable
DROP TABLE "_ConversationToProfile";

-- DropTable
DROP TABLE "_GenreToProfile";

-- DropTable
DROP TABLE "_ProfileToSpeciality";

-- DropTable
DROP TABLE "_TaggedPosts";

-- CreateTable
CREATE TABLE "_bands_genres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_bands_genres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_profiles_bands" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_profiles_bands_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_profiles_conversations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_profiles_conversations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_profiles_genres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_profiles_genres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_posts_profiles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_posts_profiles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_profiles_specialities" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_profiles_specialities_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_bands_genres_B_index" ON "_bands_genres"("B");

-- CreateIndex
CREATE INDEX "_profiles_bands_B_index" ON "_profiles_bands"("B");

-- CreateIndex
CREATE INDEX "_profiles_conversations_B_index" ON "_profiles_conversations"("B");

-- CreateIndex
CREATE INDEX "_profiles_genres_B_index" ON "_profiles_genres"("B");

-- CreateIndex
CREATE INDEX "_posts_profiles_B_index" ON "_posts_profiles"("B");

-- CreateIndex
CREATE INDEX "_profiles_specialities_B_index" ON "_profiles_specialities"("B");

-- AddForeignKey
ALTER TABLE "_bands_genres" ADD CONSTRAINT "_bands_genres_A_fkey" FOREIGN KEY ("A") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bands_genres" ADD CONSTRAINT "_bands_genres_B_fkey" FOREIGN KEY ("B") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_bands" ADD CONSTRAINT "_profiles_bands_A_fkey" FOREIGN KEY ("A") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_bands" ADD CONSTRAINT "_profiles_bands_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_conversations" ADD CONSTRAINT "_profiles_conversations_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_conversations" ADD CONSTRAINT "_profiles_conversations_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_genres" ADD CONSTRAINT "_profiles_genres_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_genres" ADD CONSTRAINT "_profiles_genres_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_posts_profiles" ADD CONSTRAINT "_posts_profiles_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_posts_profiles" ADD CONSTRAINT "_posts_profiles_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_specialities" ADD CONSTRAINT "_profiles_specialities_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_profiles_specialities" ADD CONSTRAINT "_profiles_specialities_B_fkey" FOREIGN KEY ("B") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
