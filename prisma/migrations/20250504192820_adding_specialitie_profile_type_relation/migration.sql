/*
  Warnings:

  - Added the required column `profile_type_id` to the `specialities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "specialities" ADD COLUMN     "profile_type_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "specialities" ADD CONSTRAINT "specialities_profile_type_id_fkey" FOREIGN KEY ("profile_type_id") REFERENCES "profile_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
