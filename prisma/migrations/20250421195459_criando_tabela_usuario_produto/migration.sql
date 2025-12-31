-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `senha` VARCHAR(200) NOT NULL,
    `cargo` VARCHAR(20) NOT NULL,
    `acessos` JSON NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletadoEm` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `id` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(255) NOT NULL,
    `modelo` VARCHAR(255) NOT NULL,
    `valor_vista` DECIMAL(20, 2) NOT NULL,
    `valor_parcelado` DECIMAL(20, 2) NOT NULL,
    `numero_parcela` INTEGER NOT NULL,
    `foto` JSON NULL,
    `descricao_tecnica` TEXT NOT NULL,
    `id_usu_fk` VARCHAR(36) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletadoEm` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_id_usu_fk_fkey` FOREIGN KEY (`id_usu_fk`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
