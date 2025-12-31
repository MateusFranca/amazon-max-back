/*
  Warnings:

  - Added the required column `senha_offline` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `senha_offline` VARCHAR(200) NOT NULL;
