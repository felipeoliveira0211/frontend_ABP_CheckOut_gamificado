import React, { useState } from 'react';
import { useCheckout } from '../hooks/useCheckout.js';
import { DiscountWheel } from '../components/DiscountWheel.jsx';
import { CouponValidationInfo } from '../components/CouponValidationInfo.jsx';
import { ArrowLeft, CreditCard, ShoppingBag, Send, AlertTriangle, CheckCircle, Sparkles, Receipt, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutPage = () => {
  const {
    carrinho,
    usuarioAtivo,
    cupomAplicado,
    descontoRoleta,
    subtotal,
    descontoCupom,
    descontoRoletaValor,
    total,
    economiaTotal,
    aplicarCupom,
    removerCupom,
    realizarCheckout,
  } = useCheckout();

  const navigate = useNavigate();
  const [codigoInput, setCodigoInput] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [showModalSucesso, setShowModalSucesso] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroPagamento, setErroPagamento] = useState(null);

  // Customer Data for NFE Emission
  const [dadosNfe, setDadosNfe] = useState({
    nome: '',
    email: '',
    cpf: '',
    cep: '',
    rua: '',
    cidade: '',
    estado: ''
  });

  // Credit Card details
  const [cartaoInfo, setCartaoInfo] = useState({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });

  const handleValidarCupomLocal = (e) => {
    e.preventDefault();
    aplicarCupom(codigoInput);
  };

  const handleRemoverCupomLocal = () => {
    setCodigoInput('');
    removerCupom();
  };

  const handleSelectCodigoCupom = (codigo) => {
    setCodigoInput(codigo);
    aplicarCupom(codigo);
  };

  const handleConfirmarPagamento = () => {
    setErroPagamento(null);
    
    if (carrinho.length === 0) {
      setErroPagamento("Sua mochila de inventário está vazia! Escolha equipamentos na primeira página antes.");
      return;
    }

    // Customer Inputs Validation
    if (!dadosNfe.nome.trim() || !dadosNfe.email.trim() || !dadosNfe.cpf.trim() || !dadosNfe.cep.trim() || !dadosNfe.rua.trim() || !dadosNfe.cidade.trim() || !dadosNfe.estado.trim()) {
      setErroPagamento("Impossível prosseguir: Preencha todos os dados exigidos no formulário de Dados do Cliente!");
      return;
    }

    // Card details validation if card selected
    if (formaPagamento === 'cartao') {
      if (!cartaoInfo.numero.trim() || !cartaoInfo.nome.trim() || !cartaoInfo.validade.trim() || !cartaoInfo.cvv.trim()) {
        setErroPagamento("Por favor, preencha as informações do Cartão de Crédito.");
        return;
      }
    }

    const res = realizarCheckout(formaPagamento);

    if (res.sucesso) {
      setMensagemSucesso(res.mensagem);
      setShowModalSucesso(true);
    } else {
      setErroPagamento(res.mensagem);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-10"
    >
      
      {/* Voltar */}
      <div className="mb-6">
        <Link
          to="/"
          id="link-go-back-cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Carrinho
        </Link>
      </div>

      <div className="mb-8 text-center md:text-left">
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-sans">
          Finalizar Pedido
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-sans">
          Preencha seus dados de entrega e selecione a forma de pagamento recomendada.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (7 cols) - Gamification, Coupons, then Customer Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: Gamified Discount Wheel */}
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider bg-zinc-800 text-cyan-400 border border-zinc-700 rounded uppercase font-sans">
              Passo 1: Desconto Extra na Roleta
            </span>
            <DiscountWheel />
          </div>

          {/* STEP 2: Clean Coupon Validation */}
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider bg-zinc-800 text-cyan-400 border border-zinc-700 rounded uppercase font-sans">
              Passo 2: Aplicar Cupom
            </span>
            <div className="rounded-xl p-5 border border-zinc-700 bg-[#12131b] flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                  Digitar Código de Cupom
                </h3>
              </div>

              <form onSubmit={handleValidarCupomLocal} className="flex gap-2">
                <input
                  id="input-coupon-text"
                  type="text"
                  placeholder="Seu cupom (Ex: GEEK10, LIVRO15)"
                  value={codigoInput}
                  onChange={(e) => {
                    setCodigoInput(e.target.value);
                    aplicarCupom(e.target.value);
                  }}
                  className="flex-grow h-10 rounded-lg bg-[#0c0d14] border border-zinc-800 px-3 text-white text-xs uppercase"
                />
                {cupomAplicado ? (
                  <button
                    id="btn-remove-coupon"
                    type="button"
                    onClick={handleRemoverCupomLocal}
                    className="h-10 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all cursor-pointer"
                  >
                    Remover
                  </button>
                ) : (
                  <button
                    id="btn-apply-coupon"
                    type="submit"
                    className="h-10 px-4 rounded-lg bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-bold text-xs uppercase cursor-pointer transition-all"
                  >
                    Validar
                  </button>
                )}
              </form>

              <CouponValidationInfo
                codigoDigitado={codigoInput}
                onSelectCodigo={handleSelectCodigoCupom}
              />
            </div>
          </div>

          {/* STEP 3: NFE Customer Details Form */}
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider bg-zinc-800 text-cyan-400 border border-zinc-700 rounded uppercase font-sans">
              Passo 3: Dados de Cliente
            </span>
            <div className="rounded-xl p-6 border border-zinc-700 bg-[#12131b]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2 font-sans">
                <FileText className="h-4 w-4 text-cyan-400" />
                Dados de Cliente
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 text-left">
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">Nome Completo</label>
                  <input
                    type="text"
                    value={dadosNfe.nome}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, nome: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-805 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">E-mail</label>
                  <input
                    type="email"
                    value={dadosNfe.email}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, email: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-805 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">CPF / CNPJ</label>
                  <input
                    type="text"
                    value={dadosNfe.cpf}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, cpf: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-805 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">CEP</label>
                  <input
                    type="text"
                    value={dadosNfe.cep}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, cep: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-805 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">Cidade</label>
                  <input
                    type="text"
                    value={dadosNfe.cidade}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, cidade: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-805 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">Endereço (Rua, Número)</label>
                  <input
                    type="text"
                    value={dadosNfe.rua}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, rua: e.target.value })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-850 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase mb-1 font-sans">Estado</label>
                  <input
                    type="text"
                    value={dadosNfe.estado}
                    maxLength={2}
                    onChange={(e) => setDadosNfe({ ...dadosNfe, estado: e.target.value.toUpperCase() })}
                    className="w-full h-10 rounded-lg bg-[#0c0d14] border border-zinc-850 focus:border-cyan-500 focus:outline-none px-3 text-xs text-white text-center uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns (5 cols) - Cart Summary & Payment options */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Resumo de Itens do Carrinho */}
          <div className="rounded-xl border border-zinc-700 bg-[#12131b] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2 font-sans">
              <ShoppingBag className="h-4 w-4 text-cyan-400" />
              Itens no Carrinho ({carrinho.length})
            </h3>

            {carrinho.length === 0 ? (
              <p className="text-xs text-center text-zinc-500 font-sans py-4">O carrinho está vazio.</p>
            ) : (
              <div className="divide-y divide-zinc-805 max-h-40 overflow-y-auto pr-1">
                {carrinho.map((item) => (
                  <div key={item.produto.id} className="py-2.5 flex items-center justify-between text-xs font-sans">
                    <div className="text-left max-w-[70%]">
                      <span className="text-white font-bold truncate block">{item.produto.nome}</span>
                      <span className="text-[10px] text-zinc-500">{item.quantidade}x R$ {item.produto.preco.toFixed(2)}</span>
                    </div>
                    <span className="text-zinc-300 font-semibold">
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods selector (Exact names: Cartao, Boleto, Pix) */}
          <div className="rounded-xl border border-zinc-700 bg-[#12131b] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-sans">
              Forma de Pagamento
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                id="payment-pix"
                type="button"
                onClick={() => setFormaPagamento('pix')}
                className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all border cursor-pointer ${
                  formaPagamento === 'pix'
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                    : 'border-zinc-800 bg-[#0c0d14] text-zinc-400 hover:text-white'
                }`}
              >
                <Send className="h-4 w-4" />
                Pix
              </button>

              <button
                id="payment-cartao"
                type="button"
                onClick={() => setFormaPagamento('cartao')}
                className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all border cursor-pointer ${
                  formaPagamento === 'cartao'
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                    : 'border-zinc-800 bg-[#0c0d14] text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Cartão
              </button>

              <button
                id="payment-boleto"
                type="button"
                onClick={() => setFormaPagamento('boleto')}
                className={`py-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all border cursor-pointer ${
                  formaPagamento === 'boleto'
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                    : 'border-zinc-800 bg-[#0c0d14] text-zinc-400 hover:text-white'
                }`}
              >
                <Receipt className="h-4 w-4" />
                Boleto
              </button>
            </div>

            {/* Dynamic details per option */}
            <div className="bg-[#0c0d14] border border-zinc-850 p-4 rounded-lg text-left text-xs font-sans space-y-3">
              {formaPagamento === 'pix' && (
                <div className="flex flex-col items-center text-center py-2 space-y-2">
                  <div className="h-28 w-28 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-inner">
                    {/* Simulated elegant static scan QR box */}
                    <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#000,#000_6px,#fff_6px,#fff_12px)] opacity-90 rounded border border-gray-300" />
                  </div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Aprovação imediata via Pix QR Code</p>
                </div>
              )}

              {formaPagamento === 'boleto' && (
                <div className="space-y-1 py-1 text-center sm:text-left">
                  <p className="font-bold text-zinc-200">Boleto Bancário</p>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-sans">
                    Vencimento em 3 dias úteis. A compensação pode levar até 48 horas úteis após o pagamento.
                  </p>
                </div>
              )}

              {formaPagamento === 'cartao' && (
                <div className="space-y-3 font-sans">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-0.5">Número do Cartão de Crédito</label>
                    <input
                      type="text"
                      value={cartaoInfo.numero}
                      onChange={(e) => setCartaoInfo({ ...cartaoInfo, numero: e.target.value })}
                      className="w-full h-8 rounded bg-[#0c0d14] border border-zinc-800 px-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-0.5">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      value={cartaoInfo.nome}
                      onChange={(e) => setCartaoInfo({ ...cartaoInfo, nome: e.target.value.toUpperCase() })}
                      className="w-full h-8 rounded bg-[#0c0d14] border border-zinc-800 px-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-0.5">Validade (MM/AA)</label>
                      <input
                        type="text"
                        value={cartaoInfo.validade}
                        onChange={(e) => setCartaoInfo({ ...cartaoInfo, validade: e.target.value })}
                        className="w-full h-8 rounded bg-[#0c0d14] border border-zinc-800 px-2 text-xs text-white text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-0.5">CVV (3 dígitos)</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cartaoInfo.cvv}
                        onChange={(e) => setCartaoInfo({ ...cartaoInfo, cvv: e.target.value })}
                        className="w-full h-8 rounded bg-[#0c0d14] border border-zinc-800 px-2 text-xs text-white text-center"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing calculations card */}
          <div className="rounded-xl border border-zinc-700 bg-[#12131b] p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 pt-1 border-b border-zinc-800 pb-2 font-sans">
              Resumo Financeiro
            </h3>

            <div className="space-y-2 text-xs text-zinc-300 font-sans">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span className="text-white">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {cupomAplicado && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Cupom ({cupomAplicado.codigo} -{cupomAplicado.descontoPorcentagem}%):</span>
                  <span>- R$ {descontoCupom.toFixed(2)}</span>
                </div>
              )}

              {descontoRoleta > 0 && (
                <div className="flex items-center justify-between text-cyan-400">
                  <span>Bônus Roleta (-{descontoRoleta}%):</span>
                  <span>- R$ {descontoRoletaValor.toFixed(2)}</span>
                </div>
              )}

              {economiaTotal > 0 && (
                <div className="flex items-center justify-between text-amber-400 font-bold border-t border-b border-zinc-800 py-1.5 my-1.5 animate-pulse">
                  <span>Economia Total:</span>
                  <span>R$ {economiaTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-3 text-white border-t border-dashed border-zinc-850">
                <span className="text-xs uppercase tracking-wider font-bold font-sans">Total Geral:</span>
                <p className="text-lg font-bold text-cyan-400 font-sans">
                  R$ <span className="text-xl text-white font-sans">{total.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Error messaging panel */}
            {erroPagamento && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 flex gap-2 items-start text-xs text-left">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-red-450 leading-normal font-sans">{erroPagamento}</span>
              </div>
            )}

            {/* Complete order button */}
            <button
              id="btn-confirm-transaction"
              onClick={handleConfirmarPagamento}
              className="mt-6 w-full h-12 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all font-sans"
            >
              Confirmar Pagamento
            </button>
          </div>

        </div>

      </div>

      {/* Success Modal / Purchase finished */}
      <AnimatePresence>
        {showModalSucesso && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="max-w-md w-full rounded-2xl p-6 border border-zinc-700 text-center relative shadow-2xl bg-[#12131b]"
            >
              <div className="absolute top-4 right-4 text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>

              <h2 className="text-base font-bold text-white uppercase tracking-tight font-sans">
                Pedido Recebido!
              </h2>
              
              <p className="text-[10px] text-emerald-400 font-sans mt-1 uppercase tracking-widest font-bold">
                COMPRA FINALIZADA COM SUCESSO
              </p>

              <p className="text-xs text-zinc-300 mt-4 leading-relaxed font-sans px-2">
                {mensagemSucesso}
              </p>

              {/* Order recap block */}
              <div className="mt-4 mx-auto bg-[#0c0d14] border border-zinc-800 p-3.5 rounded-lg text-left font-sans text-xs text-zinc-400 space-y-1">
                <p>Nº do Pedido: #{Math.floor(100000 + Math.random() * 900000)}</p>
                <p>Recebedor: {dadosNfe.nome}</p>
                <p>CPF: {dadosNfe.cpf}</p>
                <p>Cidade: {dadosNfe.cidade || "Criciúma"} - {dadosNfe.estado || "SC"}</p>
                <div className="border-t border-zinc-800 pt-1.5 mt-2 flex justify-between font-bold text-zinc-200">
                  <span>Valor Pago:</span>
                  <span className="text-cyan-400">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="btn-modal-back-catalog"
                onClick={() => {
                  setShowModalSucesso(false);
                  navigate('/');
                }}
                className="mt-6 w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer font-sans"
              >
                Voltar à Página Inicial
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.main>
  );
};
