/*
  Warnings:

  - Added the required column `prazo` to the `orcamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orcamentos` ADD COLUMN `observacao` VARCHAR(100) NULL,
    ADD COLUMN `prazo` VARCHAR(100) NOT NULL;
