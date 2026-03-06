/*
  Warnings:

  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `payment` on the `Payment` table. All the data in the column will be lost.
  - The required column `paymentId` was added to the `Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "payment",
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId");
