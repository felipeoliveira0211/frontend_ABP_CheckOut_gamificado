import React from 'react';
import { useCheckout } from '../hooks/useCheckout.js';
import { useCart } from '../hooks/useCart.js';
import { Tag, CheckCircle2, XCircle, Info } from 'lucide-react';
import { CUPONS_INICIAIS } from '../data/db.js';

export const CouponValidationInfo = ({
  codigoDigitado,
  onSelectCodigo,
}) => {
  const { cupomAplicado, cupomErro } = useCheckout();
  const { carrinho: itensCarrinho } = useCart();

  // Determine current categories in the cart
  const categoriasNoCarrinho = Array.from(
    new Set(itensCarrinho.map(item => item.produto.categoria.toLowerCase()))
  );

  return (
    <div id="coupon-validation-panel" className="rounded-xl p-5 border border-zinc-700 bg-[#12131b] flex flex-col gap-4">
      
      {/* Panel Header */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-white gap-2 flex items-center font-sans">
          <Tag className="h-4 w-4 text-cyan-400" />
          Cupons de Desconto Disponíveis
        </h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Veja abaixo os cupons que você pode usar:
        </p>
      </div>

      {/* Available Coupons list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CUPONS_INICIAIS.map((cupom) => {
          const isAtivo = cupom.ativo;
          const isElegivelNoCarrinho = categoriasNoCarrinho.includes(cupom.categoriaValida.toLowerCase());
          
          let statusColor = "";
          let statusText = "";
          
          if (!isAtivo) {
            statusColor = "border-red-950/40 bg-red-950/20 text-red-400";
            statusText = "Expirado";
          } else if (isElegivelNoCarrinho) {
            statusColor = "border-emerald-950/40 bg-emerald-950/20 text-emerald-400";
            statusText = "Elegível";
          } else {
            statusColor = "border-amber-950/40 bg-amber-950/20 text-amber-400";
            statusText = "Falta Categoria";
          }

          return (
            <button
              id={`cupom-shortcut-${cupom.codigo}`}
              key={cupom.id}
              onClick={() => onSelectCodigo(cupom.codigo)}
              className="flex flex-col text-left p-3 rounded-lg border border-zinc-800 bg-[#0c0d14] hover:bg-zinc-800/80 hover:border-cyan-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-white uppercase font-sans">
                  {cupom.codigo}
                </span>
                <span className={`px-1 rounded text-[9px] font-bold uppercase border ${statusColor}`}>
                  {statusText}
                </span>
              </div>
              
              <p className="text-sm font-bold text-cyan-400">
                {cupom.descontoPorcentagem}% OFF
              </p>
              
              <div className="mt-1 text-[10px] text-zinc-400">
                Categoria: <strong className="text-zinc-200">{cupom.categoriaValida.toUpperCase()}</strong>
              </div>
            </button>
          );
        })}
      </div>

      {/* Real-time feedback box */}
      <div className="border-t border-zinc-800 pt-3">
        {cupomAplicado ? (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 flex gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-400">
                Cupom Ativado: <strong className="uppercase underline bg-emerald-950/30 px-1 py-0.5 rounded">{cupomAplicado.codigo}</strong>
              </p>
              <p className="text-[11px] text-zinc-300 mt-1 font-sans">
                Seu desconto de <strong className="text-white font-bold">{cupomAplicado.descontoPorcentagem}%</strong> foi aplicado sobre todos os itens da categoria <strong className="text-emerald-400 uppercase">{cupomAplicado.categoriaValida}</strong> no seu carrinho.
              </p>
            </div>
          </div>
        ) : cupomErro ? (
          <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 flex gap-2">
            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="text-xs font-bold text-red-400 uppercase font-sans">
                Erro de Validação do Cupom
              </p>
              <p className="text-[11px] text-zinc-300 mt-1 font-sans">
                {cupomErro}
              </p>
            </div>
          </div>
        ) : codigoDigitado ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2.5 flex gap-2 items-center">
            <Info className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-zinc-400 font-sans">
              Validando o cupom <strong className="text-white">"{codigoDigitado.toUpperCase()}"</strong> em tempo real...
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-[#0c0d14] p-3 text-center">
            <p className="text-[11px] text-zinc-500 font-sans">
              Digite um cupom ou clique nos atalhos acima para ativar um desconto.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
