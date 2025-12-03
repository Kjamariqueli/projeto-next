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
import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { excluirProduto } from '../actions'
import { toast } from 'sonner'

interface DeleteProdutoProps { produto: { id: string; nome: string } }

export default function DeleteProduto({ produto }: DeleteProdutoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const result = await excluirProduto(produto.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto excluído com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Produto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o produto <strong>{produto.nome}</strong>?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? 'Excluindo...' : 'Excluir Produto'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
