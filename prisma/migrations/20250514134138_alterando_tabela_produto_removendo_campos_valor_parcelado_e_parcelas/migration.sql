/*
  Warnings:

  - You are about to drop the column `numero_parcela` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `valor_parcelado` on the `produtos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `numero_parcela`,
    DROP COLUMN `valor_parcelado`;
