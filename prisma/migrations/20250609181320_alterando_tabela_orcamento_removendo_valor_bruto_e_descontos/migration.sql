/*
  Warnings:

  - You are about to drop the column `desconto_total_percentual` on the `orcamentos` table. All the data in the column will be lost.
  - You are about to drop the column `valor_bruto` on the `orcamentos` table. All the data in the column will be lost.
  - You are about to drop the column `valor_total_desconto` on the `orcamentos` table. All the data in the column will be lost.
  - You are about to drop the column `desconto_unitario` on the `produtos_orcamentos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orcamentos` DROP COLUMN `desconto_total_percentual`,
    DROP COLUMN `valor_bruto`,
    DROP COLUMN `valor_total_desconto`;

-- AlterTable
ALTER TABLE `produtos_orcamentos` DROP COLUMN `desconto_unitario`;
