/*
  Warnings:

  - The values [RESERVE] on the enum `RoomStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoomStatus_new" AS ENUM ('RESERVED', 'PENDING', 'AVAILABLE');
ALTER TABLE "Room" ALTER COLUMN "availabilityStatus" DROP DEFAULT;
ALTER TABLE "Room" ALTER COLUMN "availabilityStatus" TYPE "RoomStatus_new" USING ("availabilityStatus"::text::"RoomStatus_new");
ALTER TYPE "RoomStatus" RENAME TO "RoomStatus_old";
ALTER TYPE "RoomStatus_new" RENAME TO "RoomStatus";
DROP TYPE "RoomStatus_old";
ALTER TABLE "Room" ALTER COLUMN "availabilityStatus" SET DEFAULT 'AVAILABLE';
COMMIT;
