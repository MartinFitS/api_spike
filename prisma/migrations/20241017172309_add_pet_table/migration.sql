-- CreateTable
CREATE TABLE "Pet" (
    "id" SERIAL NOT NULL,
    "id_owner" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "animal" INTEGER NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);
