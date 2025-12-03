import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma-client'
import AddPedido from './_components/add-pedido'
import EditPedido from './_components/edit-pedido'
import DeletePedido from './_components/delete-pedido'

export default async function PedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { produto: true } } },
  })

  const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <AddPedido produtos={produtos} />
      </div>

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum pedido cadastrado</p>
          <p className="text-sm">Crie pedidos para testar o painel.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.nome}</TableCell>
                <TableCell>{pedido.telefone}</TableCell>
                <TableCell>{pedido.endereco}</TableCell>
                <TableCell>
                  {pedido.items.map((it) => {
                    const preco = it.produto?.preco ?? 0
                    const subtotal = preco * it.quantidade
                    return (
                      <div key={it.id} className="text-sm">
                        <div className="flex gap-2 items-baseline">
                          <span className="font-medium">{it.produto?.nome}</span>
                          <span className="text-xs text-muted-foreground">R$ {preco.toFixed(2)}</span>
                          <span className="text-xs">x{it.quantidade}</span>
                          <span className="text-xs text-muted-foreground">= R$ {subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    )
                  })}
                </TableCell>
                <TableCell>
                  {(() => {
                    const total = pedido.items.reduce((acc: number, it) => acc + ((it.produto?.preco ?? 0) * it.quantidade), 0)
                    return <span className="font-medium">R$ {total.toFixed(2)}</span>
                  })()}
                </TableCell>
                <TableCell className="text-xs">{new Date(pedido.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <EditPedido pedido={pedido} produtos={produtos} />
                    <DeletePedido pedido={pedido} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
