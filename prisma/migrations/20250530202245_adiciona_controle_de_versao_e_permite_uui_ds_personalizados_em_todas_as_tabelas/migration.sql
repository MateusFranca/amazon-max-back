/*
  Warnings:

  - You are about to drop the column `sincronizado` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `sincronizado` on the `enderecos` table. All the data in the column will be lost.
  - You are about to drop the column `sincronizado` on the `orcamentos` table. All the data in the column will be lost.
  - You are about to drop the column `sincronizado` on the `produtos` table. All the data in the column will be lost.
  - You are about to drop the column `sincronizado` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cidades` ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `clientes` DROP COLUMN `sincronizado`,
    ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `enderecos` DROP COLUMN `sincronizado`,
    ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `estados` ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `orcamentos` DROP COLUMN `sincronizado`,
    ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `sincronizado`,
    ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `produtos_orcamentos` ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `sincronizado`,
    ADD COLUMN `versao` INTEGER NOT NULL DEFAULT 1;
