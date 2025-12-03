'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { editarProduto } from '../actions'
import { toast } from 'sonner'

interface Categoria { id: string; nome: string }

interface Produto { id: string; nome: string; descricao?: string | null; preco: number; categoriaId: string }

interface EditProdutoProps {
  produto: Produto
  categorias: Categoria[]
}

export default function EditProduto({ produto, categorias }: EditProdutoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await editarProduto(produto.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto atualizado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>Atualize as informações do produto.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" name="nome" defaultValue={produto.nome} required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" name="descricao" defaultValue={produto.descricao ?? ''} disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              <Input id="preco" name="preco" defaultValue={produto.preco} type="number" step="0.01" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoria</Label>
              <select id="categoriaId" name="categoriaId" className="w-full rounded border p-2" defaultValue={produto.categoriaId} required disabled={isPending}>
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Atualizando...' : 'Atualizar Produto'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
