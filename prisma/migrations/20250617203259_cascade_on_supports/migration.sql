-- DropForeignKey
ALTER TABLE "supports" DROP CONSTRAINT "supports_post_id_fkey";

-- DropForeignKey
ALTER TABLE "supports" DROP CONSTRAINT "supports_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "supports" ADD CONSTRAINT "supports_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supports" ADD CONSTRAINT "supports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
