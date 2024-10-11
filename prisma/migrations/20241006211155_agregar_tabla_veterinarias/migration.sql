/*
  Warnings:

  - Changed the type of `cp` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `number_int` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cp",
ADD COLUMN     "cp" INTEGER NOT NULL,
DROP COLUMN "number_int",
ADD COLUMN     "number_int" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "veterinarys" (
    "id" SERIAL NOT NULL,
    "veterinarieName" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "cologne" TEXT NOT NULL,
    "number_int" INTEGER NOT NULL,
    "cp" INTEGER NOT NULL,
    "rfc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veterinarys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veterinarys_email_key" ON "veterinarys"("email");

-- CreateIndex
CREATE INDEX "veterinarys_veterinarieName_idx" ON "veterinarys"("veterinarieName");
