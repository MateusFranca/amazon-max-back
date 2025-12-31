/*
  Warnings:

  - Added the required column `id_usu_fk` to the `orcamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orcamentos` ADD COLUMN `id_usu_fk` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_id_usu_fk_fkey` FOREIGN KEY (`id_usu_fk`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
