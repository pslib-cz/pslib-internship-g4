-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Internship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyRepName" TEXT NOT NULL,
    "companyRepEmail" TEXT,
    "companyRepPhone" TEXT,
    "companyMentorName" TEXT NOT NULL,
    "companyMentorEmail" TEXT,
    "companyMentorPhone" TEXT,
    "jobDescription" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "appendixText" TEXT,
    "userId" TEXT NOT NULL,
    "classname" TEXT NOT NULL,
    "created" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "updated" DATETIME NOT NULL,
    "setId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "reservationUserId" TEXT,
    "kind" INTEGER NOT NULL DEFAULT 0,
    "highlighted" BOOLEAN NOT NULL DEFAULT false,
    "conclusion" TEXT,
    "state" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Internship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_reservationUserId_fkey" FOREIGN KEY ("reservationUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Internship" ("additionalInfo", "appendixText", "classname", "companyId", "companyMentorEmail", "companyMentorName", "companyMentorPhone", "companyRepEmail", "companyRepName", "companyRepPhone", "conclusion", "created", "creatorId", "highlighted", "id", "jobDescription", "kind", "locationId", "reservationUserId", "setId", "updated", "userId") SELECT "additionalInfo", "appendixText", "classname", "companyId", "companyMentorEmail", "companyMentorName", "companyMentorPhone", "companyRepEmail", "companyRepName", "companyRepPhone", "conclusion", "created", "creatorId", "highlighted", "id", "jobDescription", "kind", "locationId", "reservationUserId", "setId", "updated", "userId" FROM "Internship";
DROP TABLE "Internship";
ALTER TABLE "new_Internship" RENAME TO "Internship";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
