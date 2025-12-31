/*
  Warnings:

  - You are about to drop the column `id_est_fk` on the `clientes` table. All the data in the column will be lost.
  - Added the required column `id_end_fk` to the `clientes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `clientes` DROP FOREIGN KEY `clientes_id_est_fk_fkey`;

-- DropIndex
DROP INDEX `cliente_id_end_fk_fkey` ON `clientes`;

-- AlterTable
ALTER TABLE `clientes` DROP COLUMN `id_est_fk`,
    ADD COLUMN `id_end_fk` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE INDEX `cliente_id_end_fk_fkey` ON `clientes`(`id_end_fk`);

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_id_end_fk_fkey` FOREIGN KEY (`id_end_fk`) REFERENCES `enderecos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
