import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUTOS_INICIAIS, USUARIOS_INICIAIS, CUPONS_INICIAIS } from '../data/db.js';

const ContextoCarrinho = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState(PRODUTOS_INICIAIS);
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS);
  const [usuarioAtivo, setUsuarioAtivo] = useState(USUARIOS_INICIAIS[1]); // Bruno Souza (VIP) padrao
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [cupomErro, setCupomErro] = useState(null);
  const [descontoRoleta, setDescontoRoleta] = useState(0);
  const [roletaGiraJa, setRoletaGiraJa] = useState(false);

  // Adicionar item ao carrinho respeitando o estoque
  const adicionarItem = (produto) => {
    if (produto.estoque <= 0) {
      return;
    }

    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(item => item.produto.id === produto.id);
      if (itemExistente) {
        if (itemExistente.quantidade >= produto.estoque) {
          // Já atingiu o estoque limite
          return carrinhoAtual;
        }
        return carrinhoAtual.map(item => 
          item.produto.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...carrinhoAtual, { produto, quantidade: 1 }];
    });
    
    // Limpar erros de cupom anteriores para revalidar quando houver novos itens
    setCupomErro(null);
  };

  const removerItem = (produtoId) => {
    setCarrinho(carrinhoAtual => carrinhoAtual.filter(item => item.produto.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, quantidade) => {
    const item = carrinho.find(i => i.produto.id === produtoId);
    if (!item) return;

    if (quantidade <= 0) {
      removerItem(produtoId);
      return;
    }

    if (quantidade > item.produto.estoque) {
      // Excede estoque
      return;
    }

    setCarrinho(carrinhoAtual => 
      carrinhoAtual.map(i => 
        i.produto.id === produtoId ? { ...i, quantidade } : i
      )
    );
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    setCupomAplicado(null);
    setCupomErro(null);
    setDescontoRoleta(0);
    setRoletaGiraJa(false);
  };

  // Validação transparente do cupom de desconto em tempo real
  const aplicarCupom = (codigo) => {
    const codigoFormatado = codigo.trim().toUpperCase();
    
    if (!codigoFormatado) {
      setCupomAplicado(null);
      setCupomErro(null);
      return;
    }

    const cupomEncontrado = CUPONS_INICIAIS.find(c => c.codigo === codigoFormatado);

    if (!cupomEncontrado) {
      setCupomAplicado(null);
      setCupomErro(`O cupom "${codigoFormatado}" não existe no nosso sistema de fidelidade. Verifique a digitação.`);
      return;
    }

    if (!cupomEncontrado.ativo) {
      setCupomAplicado(null);
      setCupomErro(`O cupom "${codigoFormatado}" expirou ou está temporariamente inativo na Falkon.`);
      return;
    }

    // Verificar se no carrinho existe algum produto da categoria específica do cupom
    if (carrinho.length === 0) {
      setCupomAplicado(null);
      setCupomErro("Adicione produtos ao carrinho antes de validar o cupom de desconto.");
      return;
    }

    const temCategoriaCorrespondente = carrinho.some(
      item => item.produto.categoria.toLowerCase() === cupomEncontrado.categoriaValida.toLowerCase()
    );

    if (!temCategoriaCorrespondente) {
      setCupomAplicado(null);
      setCupomErro(
        `Cupom inválido para esta compra: o cupom "${cupomEncontrado.codigo}" é de uso exclusivo para a categoria "${cupomEncontrado.categoriaValida.toUpperCase()}". Atualmente, seu carrinho não possui nenhum produto elegível desta categoria.`
      );
      return;
    }

    // Cupom 100% válido!
    setCupomAplicado(cupomEncontrado);
    setCupomErro(null);
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCupomErro(null);
  };

  // Re-validar cupom se os itens do carrinho mudarem
  useEffect(() => {
    if (cupomAplicado && carrinho.length > 0) {
      const temCategoriaCorrespondente = carrinho.some(
        item => item.produto.categoria.toLowerCase() === cupomAplicado.categoriaValida.toLowerCase()
      );
      if (!temCategoriaCorrespondente) {
        setCupomErro(
          `O cupom "${cupomAplicado.codigo}" foi desativado porque você removeveu o produto da categoria "${cupomAplicado.categoriaValida.toUpperCase()}" necessário.`
        );
        setCupomAplicado(null);
      }
    } else if (carrinho.length === 0) {
      setCupomAplicado(null);
    }
  }, [carrinho, cupomAplicado]);

  const giraRoleta = (descontoGanho) => {
    if (roletaGiraJa) return;
    setDescontoRoleta(descontoGanho);
    setRoletaGiraJa(true);
  };

  const alterarUsuario = (usuarioId) => {
    const usr = usuarios.find(u => u.id === usuarioId);
    if (usr) {
      setUsuarioAtivo(usr);
    }
  };

  // Cálculos financeiros
  const calcularSubtotal = () => {
    return carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);
  };

  // O cupom aplica a porcentagem correspondente apenas aos itens da categoria do cupom! (Regra de cupom realista e requintada)
  const calcularDescontoCupom = () => {
    if (!cupomAplicado) return 0;
    
    return carrinho.reduce((acc, item) => {
      if (item.produto.categoria.toLowerCase() === cupomAplicado.categoriaValida.toLowerCase()) {
        const valorItem = item.produto.preco * item.quantidade;
        return acc + (valorItem * (cupomAplicado.descontoPorcentagem / 100));
      }
      return acc;
    }, 0);
  };

  // O desconto ganho na roleta de gamificação aplica-se sobre o valor restante
  const calcularDescontoRoletaVal = () => {
    if (descontoRoleta <= 0) return 0;
    const precoAposCupom = calcularSubtotal() - calcularDescontoCupom();
    return precoAposCupom * (descontoRoleta / 100);
  };

  const calcularTotalFinal = () => {
    const total = calcularSubtotal() - calcularDescontoCupom() - calcularDescontoRoletaVal();
    return Math.max(total, 0);
  };

  const realizarCheckout = (metodoPagamento) => {
    if (carrinho.length === 0) {
      return { sucesso: false, mensagem: "Seu carrinho está vazio!" };
    }

    const total = calcularTotalFinal();
    
    // Only apply wallet checks if paying via wallet
    if (!metodoPagamento || metodoPagamento === 'carteira') {
      if (usuarioAtivo.carteiraSaldo < total) {
        const falta = total - usuarioAtivo.carteiraSaldo;
        return { 
          sucesso: false, 
          mensagem: `Saldo insuficiente na carteira gamer! Seu saldo é R$ ${usuarioAtivo.carteiraSaldo.toFixed(2)}, mas sua compra deu R$ ${total.toFixed(2)} (Faltam R$ ${falta.toFixed(2)}).` 
        };
      }

      // Deduzir saldo do usuário ativo
      setUsuarios(usuariosAtuais => {
        return usuariosAtuais.map(u => {
          if (u.id === usuarioAtivo.id) {
            const novoSaldo = u.carteiraSaldo - total;
            // Atualiza usuário ativo correspondente
            setUsuarioAtivo(prev => ({ ...prev, carteiraSaldo: novoSaldo }));
            return { ...u, carteiraSaldo: novoSaldo };
          }
          return u;
        });
      });
    }

    // Baixar o estoque simulado de produtos
    setProdutosDisponiveis(produtosAtuais => {
      return produtosAtuais.map(p => {
        const itemCarrinho = carrinho.find(c => c.produto.id === p.id);
        if (itemCarrinho) {
          return {
            ...p,
            estoque: Math.max(p.estoque - itemCarrinho.quantidade, 0)
          };
        }
        return p;
      });
    });

    // Limpar estado
    setCarrinho([]);
    setCupomAplicado(null);
    setDescontoRoleta(0);
    setRoletaGiraJa(false);

    let mensagemDefinida = "GG WP! Compra realizada com sucesso. Seus equipamentos gamer já estão sendo empacotados pela Falkon Tech.";
    if (metodoPagamento === 'pix') {
      mensagemDefinida = "Sua compra via Pix foi recebida e processada com sucesso! Pagamento confirmado de forma instantânea. A nota fiscal eletrônica (NFE) foi enviada para o seu e-mail cadastrado.";
    } else if (metodoPagamento === 'boleto') {
      mensagemDefinida = "Seu boleto bancário foi emitido com sucesso! O código de barras foi enviado ao seu e-mail. Após a compensação, enviaremos seus itens e a Nota Fiscal Eletrônica (NFE).";
    } else if (metodoPagamento === 'cartao') {
      mensagemDefinida = "Seu pagamento com Cartão de Crédito foi autorizado com sucesso! A Nota Fiscal Eletrônica (NFE) foi emitida automaticamente e seus itens já entraram na rota de envio.";
    }

    return { 
      sucesso: true, 
      mensagem: mensagemDefinida
    };
  };

  return (
    <ContextoCarrinho.Provider
      value={{
        carrinho,
        produtosDisponiveis,
        usuarioAtivo,
        usuariosDeSimulacao: usuarios,
        cupomAplicado,
        cupomErro,
        descontoRoleta,
        roletaGiraJa,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        aplicarCupom,
        removerCupom,
        giraRoleta,
        alterarUsuario,
        realizarCheckout,
        calcularSubtotal,
        calcularDescontoCupom,
        calcularDescontoRoletaVal,
        calcularTotalFinal
      }}
    >
      {children}
    </ContextoCarrinho.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(ContextoCarrinho);
  if (context === undefined) {
    throw new Error('useCartContext deve ser usado dentro de um CartProvider');
  }
  return context;
};
