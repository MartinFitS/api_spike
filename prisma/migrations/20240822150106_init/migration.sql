-- CreateTable
CREATE TABLE "holamundo" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holamundo_pkey" PRIMARY KEY ("id")
);
