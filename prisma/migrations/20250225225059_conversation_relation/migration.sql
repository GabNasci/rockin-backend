/*
  Warnings:

  - Added the required column `conversation_id` to the `conversation_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversation_profiles" ADD COLUMN     "conversation_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "conversation_profiles" ADD CONSTRAINT "conversation_profiles_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
