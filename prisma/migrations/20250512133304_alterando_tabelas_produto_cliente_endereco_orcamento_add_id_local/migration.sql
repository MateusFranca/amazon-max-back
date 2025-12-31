-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `id_local` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `enderecos` ADD COLUMN `id_local` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `orcamentos` ADD COLUMN `id_local` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `id_local` VARCHAR(36) NULL;
