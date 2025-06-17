-- DropForeignKey
ALTER TABLE "medias" DROP CONSTRAINT "medias_post_id_fkey";

-- AddForeignKey
ALTER TABLE "medias" ADD CONSTRAINT "medias_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
