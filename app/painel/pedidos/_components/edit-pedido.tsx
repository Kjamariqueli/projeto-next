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
import { editarPedido } from '../actions'
import { toast } from 'sonner'

interface Produto { id: string; nome: string }

interface PedidoItem { id: string; produtoId: string; quantidade: number }
interface Pedido { id: string; nome: string; endereco: string; telefone: string; items: PedidoItem[] }

interface EditPedidoProps { pedido: Pedido; produtos: Produto[] }

export default function EditPedido({ pedido, produtos }: EditPedidoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await editarPedido(pedido.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido atualizado com sucesso!')
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
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>Atualize os dados do pedido e os produtos.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input id="nome" name="nome" defaultValue={pedido.nome} required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" name="endereco" defaultValue={pedido.endereco} required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" defaultValue={pedido.telefone} required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label>Produtos</Label>
              <div className="grid gap-2 max-h-40 overflow-auto">
                {produtos.map(p => {
                  const exists = pedido.items.some((it: PedidoItem) => it.produtoId === p.id)
                  const found = pedido.items.find((it: PedidoItem) => it.produtoId === p.id)
                  const qty = found ? found.quantidade : 1
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <input type="checkbox" id={`prod_${p.id}`} name="produtoId" value={p.id} defaultChecked={exists} className="h-4 w-4" />
                      <label htmlFor={`prod_${p.id}`} className="flex-1">{p.nome}</label>
                      <input name={`quantidade_${p.id}`} type="number" defaultValue={qty} min={1} className="w-20 rounded border p-1" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Atualizando...' : 'Atualizar Pedido'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
