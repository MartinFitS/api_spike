-- CreateTable
CREATE TABLE "deceased_pets" (
    "id" SERIAL NOT NULL,
    "originalId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" TEXT NOT NULL,
    "animal" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "img" TEXT,
    "img_public_id" TEXT,
    "dateOfDeath" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deceased_pets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deceased_pets_originalId_key" ON "deceased_pets"("originalId");

-- CreateIndex
CREATE INDEX "deceased_pets_name_idx" ON "deceased_pets"("name");
