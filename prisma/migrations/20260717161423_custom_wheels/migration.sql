-- CreateTable
CREATE TABLE "Wheel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'custom',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WheelSegment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wheelId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bonusPoints" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 10,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WheelSegment_wheelId_fkey" FOREIGN KEY ("wheelId") REFERENCES "Wheel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
