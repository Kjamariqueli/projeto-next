import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma-client"
import AddProduto from "./_components/add-produto"
import EditProduto from "./_components/edit-produto"
import DeleteProduto from "./_components/delete-produto"

export default async function ProdutosPage() {
  const produtos = await prisma.produto.findMany({
    orderBy: { nome: 'asc' },
    include: { categoria: true },
  })

  const categorias = await prisma.categorias.findMany({ orderBy: { nome: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <AddProduto categorias={categorias} />
      </div>

      {produtos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum produto cadastrado</p>
          <p className="text-sm">Clique em &quot;Adicionar Produto&quot; para criar seu primeiro produto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <Card key={produto.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{produto.nome}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground">ID: {produto.id}</p>
                <p className="text-sm">Categoria: {produto.categoria?.nome ?? '-'}</p>
                <p className="text-sm">Preço: R$ {produto.preco.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-end gap-2">
                <EditProduto produto={produto} categorias={categorias} />
                <DeleteProduto produto={produto} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
