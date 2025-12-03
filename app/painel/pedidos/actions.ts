'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const pedidoSchema = z.object({
  nome: z.string().min(1, 'Nome do cliente é obrigatório'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  produtoIds: z.array(z.string()).optional(),
})

export async function criarPedido(formData: FormData) {
  const nome = String(formData.get('nome') ?? '')
  const endereco = String(formData.get('endereco') ?? '')
  const telefone = String(formData.get('telefone') ?? '')
  const produtoIds = formData.getAll('produtoId').map(String)

  const parsed = pedidoSchema.safeParse({ nome, endereco, telefone, produtoIds })
  if (!parsed.success) {
    return { error: parsed.error.issues.map(i => i.message).join(', ') }
  }

  try {
    const items = produtoIds.map((id: string) => ({ produtoId: id, quantidade: Number(formData.get(`quantidade_${id}`) ?? 1) }))

    await prisma.pedido.create({
      data: {
        nome: parsed.data.nome,
        endereco: parsed.data.endereco,
        telefone: parsed.data.telefone,
        items: { create: items },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedido.delete({ where: { id } })
    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}

export async function editarPedido(id: string, formData: FormData) {
  const nome = String(formData.get('nome') ?? '')
  const endereco = String(formData.get('endereco') ?? '')
  const telefone = String(formData.get('telefone') ?? '')
  const produtoIds = formData.getAll('produtoId').map(String)

  const parsed = pedidoSchema.safeParse({ nome, endereco, telefone, produtoIds })
  if (!parsed.success) {
    return { error: parsed.error.issues.map(i => i.message).join(', ') }
  }

  try {
    // atualizar pedido e seus items: simples estratégia - deletar items e recriar
    await prisma.pedido.update({
      where: { id },
      data: {
        nome: parsed.data.nome,
        endereco: parsed.data.endereco,
        telefone: parsed.data.telefone,
        items: {
          deleteMany: {},
          create: produtoIds.map((pid: string) => ({ produtoId: pid, quantidade: Number(formData.get(`quantidade_${pid}`) ?? 1) })),
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar pedido:', error)
    return { error: 'Erro ao editar pedido' }
  }
}
