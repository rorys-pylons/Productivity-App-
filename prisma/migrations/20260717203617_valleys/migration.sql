-- CreateTable
CREATE TABLE "Valley" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed the genesis valley so existing rows have a home
INSERT INTO "Valley" ("id", "name", "inviteCode") VALUES ('valley-genesis', 'Powerline Valley', 'f1ada2a961d3a5011d106d3f');

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valleyId" TEXT NOT NULL DEFAULT 'valley-genesis',
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#6366f1',
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Player_valleyId_fkey" FOREIGN KEY ("valleyId") REFERENCES "Valley" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("color", "createdAt", "id", "name", "points") SELECT "color", "createdAt", "id", "name", "points" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_valleyId_name_key" ON "Player"("valleyId", "name");
CREATE TABLE "new_Wheel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valleyId" TEXT NOT NULL DEFAULT 'valley-genesis',
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'custom',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wheel_valleyId_fkey" FOREIGN KEY ("valleyId") REFERENCES "Valley" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Wheel" ("createdAt", "id", "kind", "name") SELECT "createdAt", "id", "kind", "name" FROM "Wheel";
DROP TABLE "Wheel";
ALTER TABLE "new_Wheel" RENAME TO "Wheel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Valley_inviteCode_key" ON "Valley"("inviteCode");
