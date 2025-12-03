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
import { criarPedido } from '../actions'
import { toast } from 'sonner'

interface Produto { id: string; nome: string }
interface AddPedidoProps { produtos: Produto[] }

export default function AddPedido({ produtos }: AddPedidoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await criarPedido(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido criado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Pedido</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Pedido</DialogTitle>
          <DialogDescription>Crie um novo pedido com produtos selecionados.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input id="nome" name="nome" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" name="endereco" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" required disabled={isPending} />
            </div>

            <div className="space-y-2">
              <Label>Produtos</Label>
              <div className="grid gap-2 max-h-40 overflow-auto">
                {produtos.map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <input type="checkbox" id={`prod_${p.id}`} name="produtoId" value={p.id} className="h-4 w-4" />
                    <label htmlFor={`prod_${p.id}`} className="flex-1">{p.nome}</label>
                    <input name={`quantidade_${p.id}`} type="number" defaultValue={1} min={1} className="w-20 rounded border p-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Criando...' : 'Criar Pedido'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
