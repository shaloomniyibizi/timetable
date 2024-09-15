/*
  Warnings:

  - You are about to drop the column `userId` on the `timetables` table. All the data in the column will be lost.
  - Added the required column `trainerId` to the `timetables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ModuleTrainers" DROP CONSTRAINT "_ModuleTrainers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TrainerDepartments" DROP CONSTRAINT "_TrainerDepartments_B_fkey";

-- DropForeignKey
ALTER TABLE "timetables" DROP CONSTRAINT "timetables_userId_fkey";

-- AlterTable
ALTER TABLE "timetables" DROP COLUMN "userId",
ADD COLUMN     "trainerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "hod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "das" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "das_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hod_userId_key" ON "hod"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hod_departmentId_key" ON "hod"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "das_userId_key" ON "das"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "trainers_userId_key" ON "trainers"("userId");

-- AddForeignKey
ALTER TABLE "hod" ADD CONSTRAINT "hod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hod" ADD CONSTRAINT "hod_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "das" ADD CONSTRAINT "das_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainerDepartments" ADD CONSTRAINT "_TrainerDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleTrainers" ADD CONSTRAINT "_ModuleTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
