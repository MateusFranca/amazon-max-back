-- AlterTable
ALTER TABLE `orcamentos` ADD COLUMN `codigo_finame` VARCHAR(30) NULL,
    ADD COLUMN `parcelas` INTEGER NULL,
    ADD COLUMN `percentual_comissao` DECIMAL(5, 2) NULL;
