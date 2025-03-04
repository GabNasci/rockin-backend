-- AlterTable
ALTER TABLE "band_genres" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "bands" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "conversation_profiles" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "conversations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "genres" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "images" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medias" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "musician_bands" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "musician_genres" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "musician_specialities" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profile_types" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recomendations" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "specialities" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "supports" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tagged_profiles_posts" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;
