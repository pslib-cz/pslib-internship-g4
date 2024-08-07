/*
  Warnings:

  - A unique constraint covering the columns `[internshipId,date]` on the table `Diary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internshipId,date]` on the table `Inspection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Internship" ADD COLUMN "conclusion" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Diary_internshipId_date_key" ON "Diary"("internshipId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Inspection_internshipId_date_key" ON "Inspection"("internshipId", "date");
