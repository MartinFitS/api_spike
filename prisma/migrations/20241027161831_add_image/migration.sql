-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "img_public_id" TEXT,
ALTER COLUMN "img" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "img_public_id" TEXT,
ALTER COLUMN "img" DROP NOT NULL;

-- AlterTable
ALTER TABLE "veterinarys" ADD COLUMN     "img_public_id" TEXT,
ALTER COLUMN "img" DROP NOT NULL;
