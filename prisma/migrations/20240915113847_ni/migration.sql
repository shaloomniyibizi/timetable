/*
  Warnings:

  - You are about to drop the column `trainerId` on the `timetables` table. All the data in the column will be lost.
  - You are about to drop the `das` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trainers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModuleTrainers" DROP CONSTRAINT "_ModuleTrainers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TrainerDepartments" DROP CONSTRAINT "_TrainerDepartments_B_fkey";

-- DropForeignKey
ALTER TABLE "das" DROP CONSTRAINT "das_userId_fkey";

-- DropForeignKey
ALTER TABLE "hod" DROP CONSTRAINT "hod_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "hod" DROP CONSTRAINT "hod_userId_fkey";

-- DropForeignKey
ALTER TABLE "timetables" DROP CONSTRAINT "timetables_trainerId_fkey";

-- DropForeignKey
ALTER TABLE "trainers" DROP CONSTRAINT "trainers_userId_fkey";

-- AlterTable
ALTER TABLE "timetables" DROP COLUMN "trainerId",
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "das";

-- DropTable
DROP TABLE "hod";

-- DropTable
DROP TABLE "trainers";

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrainerDepartments" ADD CONSTRAINT "_TrainerDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleTrainers" ADD CONSTRAINT "_ModuleTrainers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
