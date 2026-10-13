/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_nome_key" ON "Category"("nome");
