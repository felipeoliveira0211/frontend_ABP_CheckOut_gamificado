import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductCard = ({
  produto,
  onAddToCart,
  quantidadeNoCarrinho,
  estoqueDisponivel,
}) => {
  const isEsgotado = produto.estoque === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      id={`product-card-${produto.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-700 bg-[#12131b] p-5 transition-all duration-300 hover:border-cyan-400 hover:bg-[#181a26] hover:shadow-[0_4px_22px_rgba(34,211,238,0.15)]"
    >
      {/* Product Name & Description */}
      <div className="flex-grow">
        <h3 className="font-display text-base font-bold text-white transition-colors tracking-tight line-clamp-1 mb-2 group-hover:text-cyan-300">
          {produto.nome}
        </h3>
        <p className="text-xs text-zinc-350 line-clamp-2 leading-relaxed mb-4 min-h-[32px] font-sans">
          {produto.descricao}
        </p>
      </div>

      {/* Pricing & CTA Button */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between pt-2 pb-3 border-t border-zinc-800">
          <div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Valor</span>
            <p className="font-mono text-lg font-black text-cyan-400">
              R$ {produto.preco.toFixed(2)}
            </p>
          </div>
          {quantidadeNoCarrinho > 0 && (
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
              No carrinho: {quantidadeNoCarrinho}
            </span>
          )}
        </div>

        {/* Add Button */}
        <button
          id={`btn-add-to-cart-${produto.id}`}
          onClick={() => !isEsgotado && onAddToCart(produto)}
          disabled={isEsgotado || estoqueDisponivel <= 0}
          className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
            isEsgotado || estoqueDisponivel <= 0
              ? 'bg-gray-800/20 text-gray-500 border border-gray-800 cursor-not-allowed'
              : 'bg-cyan-500 text-falkon-bg hover:bg-cyan-400 font-bold hover:shadow-md hover:shadow-cyan-400/15 cursor-pointer'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {isEsgotado ? 'Sem estoque' : estoqueDisponivel <= 0 ? 'Limite Atingido' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </motion.div>
  );
};
