'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  preco: z.coerce.number().nonnegative('Preço deve ser um número positivo'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
})

export async function criarProduto(formData: FormData) {
  const data = Object.fromEntries(formData.entries())

  const parsed = produtoSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(', ') }
  }

  try {
    await prisma.produto.create({ data: parsed.data })
    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = produtoSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(', ') }
  }

  try {
    await prisma.produto.update({ where: { id }, data: parsed.data })
    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    return { error: 'Erro ao editar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produto.delete({ where: { id } })
    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}
