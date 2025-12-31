-- CreateTable
CREATE TABLE `clientes` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `documento` VARCHAR(14) NOT NULL,
    `telefone` VARCHAR(11) NOT NULL,
    `nascimento` VARCHAR(10) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletadoEm` DATETIME(3) NULL,
    `id_est_fk` VARCHAR(36) NOT NULL,

    INDEX `cliente_id_end_fk_fkey`(`id_est_fk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `uf` VARCHAR(2) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletadoEm` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidades` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `id_est_fk` VARCHAR(36) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletadoEm` DATETIME(3) NULL,

    INDEX `cidades_id_est_fk_fkey`(`id_est_fk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `enderecos` (
    `id` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(255) NOT NULL,
    `bairro` VARCHAR(100) NOT NULL,
    `cep` VARCHAR(10) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `complemento` VARCHAR(255) NULL,
    `id_cid_fk` VARCHAR(36) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `atualizadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletadoEm` DATETIME(3) NULL,

    INDEX `enderecos_id_cid_fk_fkey`(`id_cid_fk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_id_est_fk_fkey` FOREIGN KEY (`id_est_fk`) REFERENCES `enderecos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cidades` ADD CONSTRAINT `cidades_id_est_fk_fkey` FOREIGN KEY (`id_est_fk`) REFERENCES `estados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enderecos` ADD CONSTRAINT `enderecos_id_cid_fk_fkey` FOREIGN KEY (`id_cid_fk`) REFERENCES `cidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
