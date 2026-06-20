import React, { useState } from 'react';
import { useCartContext } from '../context/CartContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ShoppingBag, ArrowRight, Trash2, Layers, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage = () => {
  const { produtosDisponiveis } = useCartContext();
  const {
    carrinho,
    quantidadeTotalItens,
    subtotal,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    obterEstoqueDisponivel,
  } = useCart();

  const navigate = useNavigate();
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');

  // Filter products by category
  const produtosFiltrados = categoriaAtiva === 'todos'
    ? produtosDisponiveis
    : produtosDisponiveis.filter(p => p.categoria.toLowerCase() === categoriaAtiva.toLowerCase());

  const handlesAvancarCheckout = () => {
    if (carrinho.length === 0) return;
    navigate('/checkout');
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10"
    >
      {/* Visual Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#12131b] border border-zinc-700 p-6 sm:p-8 mb-8 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1 rounded bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 font-sans">
              🎮 Falkon Geek Shop
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Produtos Geek &amp; Equipamentos para Jogadores
            </h1>
            <p className="mt-2 text-zinc-400 text-sm max-w-xl font-sans">
              Confira os melhores acessórios, presentes nerd e livros de tecnologia para seu setup!
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-[#0c0d14] border border-zinc-800 px-5 py-4 rounded-xl min-w-[200px]">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans">Carrinho de Compras</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-cyan-400">{quantidadeTotalItens}</span>
              <span className="text-zinc-500 text-xs font-sans">itens</span>
            </div>
            {quantidadeTotalItens > 0 && (
              <p className="text-xs text-white font-sans font-semibold">
                Subtotal: R$ <span className="text-cyan-400">{subtotal.toFixed(2)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Catalog Left, Cart Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Catalog / Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12131b]/60 border border-zinc-800 px-5 py-3.5 rounded-xl">
            <div className="flex items-center gap-2 text-white">
              <Layers className="h-4.5 w-4.5 text-cyan-400" />
              <span className="font-bold text-sm uppercase tracking-wider font-sans">Filtrar Categoria</span>
            </div>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'perifericos', label: 'Periféricos' },
                { id: 'geek', label: 'Geek' },
                { id: 'livros', label: 'Livros' },
                { id: 'monitores', label: 'Monitores' },
              ].map((pill) => {
                const isActive = categoriaAtiva === pill.id;
                return (
                  <button
                    key={pill.id}
                    id={`btn-filter-${pill.id}`}
                    onClick={() => setCategoriaAtiva(pill.id)}
                    className={`h-9 px-3.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500 text-zinc-950 shadow shadow-cyan-500/20'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {produtosFiltrados.map((item) => {
                const itemNocarrinho = carrinho.find(c => c.produto.id === item.id);
                const qtdNoCart = itemNocarrinho ? itemNocarrinho.quantidade : 0;
                
                return (
                  <ProductCard
                    key={item.id}
                    produto={item}
                    onAddToCart={adicionarItem}
                    quantidadeNoCarrinho={qtdNoCart}
                    estoqueDisponivel={obterEstoqueDisponivel(item.id)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right 1 Column: Cart Sidebar Review Box */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-zinc-700 bg-[#12131b] p-6 flex flex-col min-h-[480px]">
            
            {/* Sidebar Title */}
            <div className="flex items-center justify-between border-b border-zinc-805 pb-4 mb-4">
              <div className="flex items-center gap-2 text-white">
                <ShoppingBag className="h-5 w-5 text-cyan-400" />
                <h2 className="text-base font-bold uppercase tracking-wider font-sans">
                  Sua Compra
                </h2>
              </div>
              <span className="rounded bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase font-sans">
                {quantidadeTotalItens} ITENS
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto space-y-4 max-h-[380px] pr-1">
              <AnimatePresence mode="popLayout">
                {carrinho.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center text-zinc-500 font-sans"
                  >
                    <div className="h-12 w-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 mb-4">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <p className="text-xs uppercase tracking-wider font-semibold">Carrinho vazio</p>
                    <p className="text-[11px] text-zinc-500 max-w-[180px] mt-1 text-center">
                      Adicione produtos interessantes para finalizar o seu pedido.
                    </p>
                  </motion.div>
                ) : (
                  carrinho.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={item.produto.id}
                      className="flex gap-3 bg-[#0c0d14]/80 border border-zinc-800 p-3 rounded-lg hover:border-zinc-700 transition-colors group"
                    >
                      {/* Quantity Incrementor */}
                      <div className="flex flex-col justify-between items-center py-1">
                        <button
                          id={`qtde-inc-${item.produto.id}`}
                          onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                          disabled={item.quantidade >= item.produto.estoque}
                          className="h-5 w-5 rounded bg-zinc-800 hover:bg-cyan-500/20 text-white hover:text-cyan-400 flex items-center justify-center font-mono text-xs font-bold transition-all disabled:opacity-50"
                          title="Aumentar quantidade"
                        >
                          +
                        </button>
                        <span className="font-sans text-xs font-bold text-white px-1">
                          {item.quantidade}
                        </span>
                        <button
                          id={`qtde-dec-${item.produto.id}`}
                          onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                          className="h-5 w-5 rounded bg-zinc-800 hover:bg-rose-500/20 text-white hover:text-rose-450 flex items-center justify-center font-mono text-xs font-bold transition-all"
                          title="Diminuir quantidade"
                        >
                          -
                        </button>
                      </div>

                      {/* Detail text */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs font-bold text-white truncate uppercase font-sans">
                          {item.produto.nome}
                        </h4>
                        <span className="text-[10px] text-cyan-400 capitalize">
                          {item.produto.categoria}
                        </span>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-sans text-xs font-bold text-zinc-350">
                            R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                          </p>
                          <span className="text-[10px] text-zinc-500">
                            {item.quantidade} x R$ {item.produto.preco.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        id={`btn-remove-${item.produto.id}`}
                        onClick={() => removerItem(item.produto.id)}
                        className="h-8 w-8 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-all cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary of Cart */}
            {carrinho.length > 0 && (
              <div className="mt-4 border-t border-zinc-800 pt-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-zinc-400 uppercase">Subtotal Geral:</span>
                  <span className="text-white font-bold">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-zinc-400 uppercase">Total de Itens:</span>
                  <span className="text-white font-bold">{quantidadeTotalItens}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="btn-clear-cart"
                    onClick={limparCarrinho}
                    className="flex-shrink-0 h-11 w-11 rounded-lg border border-zinc-805 text-zinc-500 hover:text-rose-500 hover:border-rose-505 hover:bg-rose-505 flex items-center justify-center transition-all cursor-pointer"
                    title="Limpar Carrinho"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    id="btn-advance-checkout"
                    onClick={handlesAvancarCheckout}
                    className="flex-grow h-11 rounded-lg bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-bold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    Ir para Pagamento
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.main>
  );
};
