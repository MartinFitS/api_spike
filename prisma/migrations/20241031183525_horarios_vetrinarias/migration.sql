/*
  Warnings:

  - You are about to drop the column `id_owner` on the `pets` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "id_owner",
ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "veterinaryId" INTEGER NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hourId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableHour" (
    "id" SERIAL NOT NULL,
    "veterinaryId" INTEGER NOT NULL,
    "hour" TEXT NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "AvailableHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_veterinaryId_date_hourId_key" ON "Appointment"("veterinaryId", "date", "hourId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_veterinaryId_fkey" FOREIGN KEY ("veterinaryId") REFERENCES "veterinarys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hourId_fkey" FOREIGN KEY ("hourId") REFERENCES "AvailableHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableHour" ADD CONSTRAINT "AvailableHour_veterinaryId_fkey" FOREIGN KEY ("veterinaryId") REFERENCES "veterinarys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
