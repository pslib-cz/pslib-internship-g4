-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "ext_expires_in" INTEGER,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "department" TEXT,
    "role" TEXT,
    "birthDate" DATETIME,
    "phone" TEXT,
    "surname" TEXT,
    "givenName" TEXT,
    "street" TEXT,
    "descNo" INTEGER,
    "orientNo" TEXT,
    "municipality" TEXT,
    "postalCode" INTEGER
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT,
    "municipality" TEXT,
    "postalCode" INTEGER,
    "street" TEXT,
    "descNo" INTEGER,
    "orientNo" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "created" DATETIME NOT NULL,
    "text" TEXT
);

-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "companyIdentificationNumber" INTEGER,
    "description" TEXT,
    "website" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Company_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Company_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompanyBranch" (
    "companyId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "name" TEXT,
    "created" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,

    PRIMARY KEY ("companyId", "locationId"),
    CONSTRAINT "CompanyBranch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyBranch_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyBranch_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "editable" BOOLEAN NOT NULL DEFAULT true,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "representativeName" TEXT NOT NULL,
    "representativeEmail" TEXT NOT NULL,
    "representativePhone" TEXT NOT NULL,
    "continuous" BOOLEAN NOT NULL,
    "hoursDaily" INTEGER NOT NULL,
    "daysTotal" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "templateId" INTEGER NOT NULL,
    "logoName" TEXT,
    CONSTRAINT "Set_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Internship" (
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
    CONSTRAINT "Internship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Internship_reservationUserId_fkey" FOREIGN KEY ("reservationUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "internshipId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Diary_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Diary_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "internshipId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inspectionUserId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "kind" INTEGER NOT NULL,
    CONSTRAINT "Inspection_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Inspection_inspectionUserId_fkey" FOREIGN KEY ("inspectionUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "background" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CompanyTag" (
    "companyId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "created" DATETIME NOT NULL,
    "creatorId" TEXT NOT NULL,

    PRIMARY KEY ("companyId", "tagId"),
    CONSTRAINT "CompanyTag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CompanyTag_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Text" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "shortable" BOOLEAN NOT NULL DEFAULT true,
    "published" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Text_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyIdentificationNumber_key" ON "Company"("companyIdentificationNumber");
