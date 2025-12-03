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
import { excluirPedido } from '../actions'
import { toast } from 'sonner'

interface DeletePedidoProps { pedido: { id: string; nome: string } }

export default function DeletePedido({ pedido }: DeletePedidoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const result = await excluirPedido(pedido.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido excluído com sucesso!')
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
          <DialogTitle>Excluir Pedido</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o pedido de <strong>{pedido.nome}</strong>?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? 'Excluindo...' : 'Excluir Pedido'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
