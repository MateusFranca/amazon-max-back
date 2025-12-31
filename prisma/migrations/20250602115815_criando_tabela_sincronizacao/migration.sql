-- CreateTable
CREATE TABLE `sincronizacoes` (
    `id` VARCHAR(191) NOT NULL,
    `usuario` TIMESTAMP(0) NOT NULL,
    `produto` TIMESTAMP(0) NOT NULL,
    `cliente` TIMESTAMP(0) NOT NULL,
    `endereco` TIMESTAMP(0) NOT NULL,
    `orcamento` TIMESTAMP(0) NOT NULL,
    `produtoOrcamento` TIMESTAMP(0) NOT NULL,
    `criadoEm` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
