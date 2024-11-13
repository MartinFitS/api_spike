/*
  Warnings:

  - Added the required column `img` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img` to the `veterinarys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "img" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "img" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "veterinarys" ADD COLUMN     "img" TEXT NOT NULL;
