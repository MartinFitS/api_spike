/*
  Warnings:

  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cp` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_int` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cp" TEXT NOT NULL,
ADD COLUMN     "number_int" TEXT NOT NULL;
