import { useCartContext } from '../context/CartContext.jsx';

/**
 * Custom Hook para regras de negócio do Checkout Gamificado,
 * incluindo aplicação e validação de cupons e a roleta de desconto.
 */
export function useCheckout() {
  const {
    cupomAplicado,
    cupomErro,
    descontoRoleta,
    roletaGiraJa,
    usuarioAtivo,
    usuariosDeSimulacao,
    carrinho,
    aplicarCupom,
    removerCupom,
    giraRoleta,
    alterarUsuario,
    realizarCheckout,
    calcularSubtotal,
    calcularDescontoCupom,
    calcularDescontoRoletaVal,
    calcularTotalFinal,
  } = useCartContext();

  const subtotal = calcularSubtotal();
  const descontoCupom = calcularDescontoCupom();
  const descontoRoletaValor = calcularDescontoRoletaVal();
  const total = calcularTotalFinal();

  // Calcula quanto foi economizado no total (cupom + roleta)
  const economiaTotal = descontoCupom + descontoRoletaValor;
  
  // Porcentagem de desconto efetivo
  const porcentagemDescontoEfetivo = subtotal > 0 ? (economiaTotal / subtotal) * 100 : 0;

  return {
    cupomAplicado,
    cupomErro,
    descontoRoleta,
    roletaGiraJa,
    usuarioAtivo,
    usuariosDeSimulacao,
    carrinho,
    subtotal,
    descontoCupom,
    descontoRoletaValor,
    total,
    economiaTotal,
    porcentagemDescontoEfetivo,
    aplicarCupom,
    removerCupom,
    giraRoleta,
    alterarUsuario,
    realizarCheckout,
  };
}
