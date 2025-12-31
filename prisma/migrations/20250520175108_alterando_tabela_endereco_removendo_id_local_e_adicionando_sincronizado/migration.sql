/*
  Warnings:

  - You are about to drop the column `id_local` on the `enderecos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `enderecos` DROP COLUMN `id_local`,
    ADD COLUMN `sincronizado` BOOLEAN NULL DEFAULT false;
