-- CreateTable
CREATE TABLE `orcamentos` (
    `id` VARCHAR(191) NOT NULL,
    `id_cli_fk` VARCHAR(36) NOT NULL,
    `valor_bruto` DECIMAL(20, 2) NOT NULL,
    `valor_total_desconto` DECIMAL(20, 2) NOT NULL,
    `valor_final` DECIMAL(20, 2) NOT NULL,
    `desconto_total_percentual` DECIMAL(5, 2) NULL,
    `forma_pagamento` VARCHAR(100) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletadoEm` DATETIME(3) NULL,

    INDEX `orcamentos_id_cli_fk_idx`(`id_cli_fk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos_orcamentos` (
    `id` VARCHAR(191) NOT NULL,
    `id_orc_fk` VARCHAR(36) NOT NULL,
    `id_pro_fk` VARCHAR(36) NOT NULL,
    `valor_unitario` DECIMAL(20, 2) NOT NULL,
    `desconto_unitario` DECIMAL(20, 2) NOT NULL,
    `valor_final_unitario` DECIMAL(20, 2) NOT NULL,
    `quantidade` INTEGER NOT NULL,

    INDEX `produtos_orcamentos_id_orc_fk_idx`(`id_orc_fk`),
    INDEX `produtos_orcamentos_id_pro_fk_idx`(`id_pro_fk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orcamentos` ADD CONSTRAINT `orcamentos_id_cli_fk_fkey` FOREIGN KEY (`id_cli_fk`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produtos_orcamentos` ADD CONSTRAINT `produtos_orcamentos_id_orc_fk_fkey` FOREIGN KEY (`id_orc_fk`) REFERENCES `orcamentos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produtos_orcamentos` ADD CONSTRAINT `produtos_orcamentos_id_pro_fk_fkey` FOREIGN KEY (`id_pro_fk`) REFERENCES `produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
