/*
  Warnings:

  - You are about to drop the column `shortlink` on the `links` table. All the data in the column will be lost.
  - Added the required column `short` to the `links` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_links" ("id", "link", "userId") SELECT "id", "link", "userId" FROM "links";
DROP TABLE "links";
ALTER TABLE "new_links" RENAME TO "links";
CREATE UNIQUE INDEX "links_link_key" ON "links"("link");
CREATE UNIQUE INDEX "links_short_key" ON "links"("short");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
