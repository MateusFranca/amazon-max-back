/*
  Warnings:

  - You are about to drop the column `valor_vista` on the `produtos` table. All the data in the column will be lost.
  - Added the required column `valor_completo` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_exclusivo` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_medio` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_reduzido` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produtos` DROP COLUMN `valor_vista`,
    ADD COLUMN `valor_completo` DECIMAL(20, 2) NOT NULL,
    ADD COLUMN `valor_exclusivo` DECIMAL(20, 2) NOT NULL,
    ADD COLUMN `valor_medio` DECIMAL(20, 2) NOT NULL,
    ADD COLUMN `valor_reduzido` DECIMAL(20, 2) NOT NULL;
