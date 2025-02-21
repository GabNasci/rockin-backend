/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "bandd_genres" (
    "id" SERIAL NOT NULL,
    "band_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "bandd_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bands" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "note" INTEGER NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "state" TEXT,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musician_bands" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "band_id" INTEGER NOT NULL,

    CONSTRAINT "musician_bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musician_genres" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,

    CONSTRAINT "musician_genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musician_specialities" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,

    CONSTRAINT "musician_specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "link" TEXT,
    "datetime" TIMESTAMP(3) NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "profile_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "about" TEXT,
    "avatar" TEXT,
    "spotify_id" TEXT,
    "user_id" INTEGER NOT NULL,
    "profile_type_id" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recomendations" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "recomendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supports" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "supports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagged_profiles" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "tagged_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_handle_key" ON "profiles"("handle");
