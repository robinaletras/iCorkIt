/*
  Warnings:

  - You are about to drop the column `corkitsPerDay` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `totalCorkitsCost` on the `Pin` table. All the data in the column will be lost.
  - You are about to drop the column `corkits` on the `User` table. All the data in the column will be lost.
  - Added the required column `pinsUsed` to the `Pin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "boardId" TEXT,
    "userId" TEXT NOT NULL,
    "pinsUsed" INTEGER NOT NULL,
    "daysPinned" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pin_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pin_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pin" ("boardId", "createdAt", "daysPinned", "endDate", "id", "isActive", "postId", "startDate", "updatedAt", "userId") SELECT "boardId", "createdAt", "daysPinned", "endDate", "id", "isActive", "postId", "startDate", "updatedAt", "userId" FROM "Pin";
DROP TABLE "Pin";
ALTER TABLE "new_Pin" RENAME TO "Pin";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pinsRemaining" INTEGER NOT NULL DEFAULT 200,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "displayName", "email", "id", "isAdmin", "password", "pinsRemaining", "updatedAt") SELECT "createdAt", "displayName", "email", "id", "isAdmin", "password", "pinsRemaining", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
