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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-700 bg-[#12131b] p-4 transition-all duration-300 hover:border-cyan-400"
    >

      {/* IMAGEM ESTILO AMAZON */}
      <div className="product-image-wrapper mb-3">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="product-image"
        />
      </div>

      {/* TITULO */}
      <div className="flex-grow">
        <h3 className="font-display text-base font-bold text-white line-clamp-1 mb-1 group-hover:text-cyan-300">
          {produto.nome}
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
          {produto.descricao}
        </p>
      </div>

      {/* PREÇO */}
      <div className="mt-4 border-t border-zinc-800 pt-3">
        <span className="text-[10px] text-zinc-500 uppercase">Valor</span>

        <p className="text-lg font-bold text-cyan-400">
          R$ {produto.preco.toFixed(2)}
        </p>

        {quantidadeNoCarrinho > 0 && (
          <span className="text-[10px] text-cyan-400">
            No carrinho: {quantidadeNoCarrinho}
          </span>
        )}
      </div>

      {/* BOTÃO */}
      <button
        onClick={() => !isEsgotado && onAddToCart(produto)}
        disabled={isEsgotado || estoqueDisponivel <= 0}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold uppercase transition-all ${
          isEsgotado || estoqueDisponivel <= 0
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-cyan-500 text-black hover:bg-cyan-400'
        }`}
      >
        <ShoppingCart className="h-4 w-4" />
        {isEsgotado ? 'Sem estoque' : 'Adicionar ao carrinho'}
      </button>
    </motion.div>
  );
};