/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `featureAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menuAccess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menuFeatures` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "featureAccess" DROP CONSTRAINT "featureAccess_features_id_fkey";

-- DropForeignKey
ALTER TABLE "featureAccess" DROP CONSTRAINT "featureAccess_menu_access_id_fkey";

-- DropForeignKey
ALTER TABLE "menu" DROP CONSTRAINT "menu_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "menuAccess" DROP CONSTRAINT "menuAccess_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "menuAccess" DROP CONSTRAINT "menuAccess_role_id_fkey";

-- DropForeignKey
ALTER TABLE "menuFeatures" DROP CONSTRAINT "menuFeatures_menu_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "featureAccess";

-- DropTable
DROP TABLE "menu";

-- DropTable
DROP TABLE "menuAccess";

-- DropTable
DROP TABLE "menuFeatures";

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "path" TEXT,
    "is_submenu" BOOLEAN NOT NULL DEFAULT false,
    "parent_id" INTEGER,
    "permissions" TEXT[],
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "grant" JSONB NOT NULL,

    CONSTRAINT "access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_name_key" ON "menus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_key" ON "roles"("role");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access" ADD CONSTRAINT "access_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access" ADD CONSTRAINT "access_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
