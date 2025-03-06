/*
  Warnings:

  - You are about to drop the `band_genres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `musician_bands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tagged_profiles_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "band_genres" DROP CONSTRAINT "band_genres_band_id_fkey";

-- DropForeignKey
ALTER TABLE "band_genres" DROP CONSTRAINT "band_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_profiles" DROP CONSTRAINT "conversation_profiles_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversation_profiles" DROP CONSTRAINT "conversation_profiles_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "musician_bands" DROP CONSTRAINT "musician_bands_band_id_fkey";

-- DropForeignKey
ALTER TABLE "musician_bands" DROP CONSTRAINT "musician_bands_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "tagged_profiles_posts" DROP CONSTRAINT "tagged_profiles_posts_post_id_fkey";

-- DropForeignKey
ALTER TABLE "tagged_profiles_posts" DROP CONSTRAINT "tagged_profiles_posts_profile_id_fkey";

-- DropTable
DROP TABLE "band_genres";

-- DropTable
DROP TABLE "conversation_profiles";

-- DropTable
DROP TABLE "musician_bands";

-- DropTable
DROP TABLE "tagged_profiles_posts";

-- CreateTable
CREATE TABLE "_BandToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BandToGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BandMembers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BandMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ConversationToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ConversationToProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TaggedPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TaggedPosts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BandToGenre_B_index" ON "_BandToGenre"("B");

-- CreateIndex
CREATE INDEX "_BandMembers_B_index" ON "_BandMembers"("B");

-- CreateIndex
CREATE INDEX "_ConversationToProfile_B_index" ON "_ConversationToProfile"("B");

-- CreateIndex
CREATE INDEX "_TaggedPosts_B_index" ON "_TaggedPosts"("B");

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandMembers" ADD CONSTRAINT "_BandMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandMembers" ADD CONSTRAINT "_BandMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToProfile" ADD CONSTRAINT "_ConversationToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToProfile" ADD CONSTRAINT "_ConversationToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaggedPosts" ADD CONSTRAINT "_TaggedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaggedPosts" ADD CONSTRAINT "_TaggedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
