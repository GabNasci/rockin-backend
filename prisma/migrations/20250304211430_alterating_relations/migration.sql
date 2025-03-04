/*
  Warnings:

  - You are about to drop the `musician_specialities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "musician_specialities" DROP CONSTRAINT "musician_specialities_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "musician_specialities" DROP CONSTRAINT "musician_specialities_speciality_id_fkey";

-- DropTable
DROP TABLE "musician_specialities";

-- CreateTable
CREATE TABLE "_ProfileToSpeciality" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfileToSpeciality_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfileToSpeciality_B_index" ON "_ProfileToSpeciality"("B");

-- AddForeignKey
ALTER TABLE "_ProfileToSpeciality" ADD CONSTRAINT "_ProfileToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToSpeciality" ADD CONSTRAINT "_ProfileToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
