import { useCartContext } from '../context/CartContext.jsx';

/**
 * Custom Hook para gerenciar as regras de negócio de adição,
 * remoção, quantidade e estatísticas do carrinho de compras.
 */
export function useCart() {
  const {
    carrinho,
    produtosDisponiveis,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    calcularSubtotal,
  } = useCartContext();

  const quantidadeTotalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const obterEstoqueDisponivel = (produtoId) => {
    const prod = produtosDisponiveis.find(p => p.id === produtoId);
    if (!prod) return 0;
    
    const itemNoCarrinho = carrinho.find(item => item.produto.id === produtoId);
    const qtdeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
    
    return Math.max(prod.estoque - qtdeNoCarrinho, 0);
  };

  const verificarSeEstaNoCarrinho = (produtoId) => {
    return carrinho.some(item => item.produto.id === produtoId);
  };

  return {
    carrinho,
    quantidadeTotalItens,
    subtotal: calcularSubtotal(),
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    obterEstoqueDisponivel,
    verificarSeEstaNoCarrinho,
  };
}
