export const PRODUTOS_INICIAIS = [
  {
    id: "1",
    nome: "Teclado Mecânico RGB",
    descricao: "Switch Blue, layout ABNT2 com fio destacável.",
    preco: 350.00,
    categoria: "perifericos",
    estoque: 5,
    promocao: true,
    nota: 4.5
  },
  {
    id: "2",
    nome: "Mouse Gamer 12000 DPI",
    descricao: "Sensor óptico de alta precisão e peso regulável.",
    preco: 180.00,
    categoria: "perifericos",
    estoque: 12,
    promocao: false,
    nota: 4.8
  },
  {
    id: "3",
    nome: "Monitor 24 polegadas 144Hz",
    descricao: "Painel IPS com 1ms de resposta e ajuste de altura.",
    preco: 1200.00,
    categoria: "monitores",
    estoque: 1,
    promocao: false,
    nota: 4.2
  },
  {
    id: "4",
    nome: "Caneca Termo-sensível Star Wars",
    descricao: "Muda de estampa quando adicionado líquido quente.",
    preco: 60.00,
    categoria: "geek",
    estoque: 25,
    promocao: true,
    nota: 4.0
  },
  {
    id: "5",
    nome: "Livro: Clean Code",
    descricao: "Manual de boas práticas de software para desenvolvedores.",
    preco: 95.00,
    categoria: "livros",
    estoque: 0, // Indisponível
    promocao: false,
    nota: 4.9
  },
  {
    id: "6",
    nome: "Action Figure Batman",
    descricao: "Miniatura articulada de 18cm com acessórios.",
    preco: 290.00,
    categoria: "geek",
    estoque: 4,
    promocao: false,
    nota: 4.6
  },
  {
    id: "7",
    nome: "Headset Gamer 7.1 Surround",
    descricao: "Isolamento acústico e microfone com cancelamento de ruído.",
    preco: 420.00,
    categoria: "perifericos",
    estoque: 8,
    promocao: true,
    nota: 3.9
  },
  {
    id: "8",
    nome: "Comic Book: O Cavaleiro das Trevas",
    descricao: "Edição definitiva encadernada e capa dura.",
    preco: 110.00,
    categoria: "livros",
    estoque: 15,
    promocao: false,
    nota: 5.0
  }
];

export const USUARIOS_INICIAIS = [
  {
    id: "1",
    nome: "Ana Silva",
    email: "ana@email.com",
    nivel: "admin",
    carteiraSaldo: 1500.00
  },
  {
    id: "2",
    nome: "Bruno Souza",
    email: "bruno@email.com",
    nivel: "vip",
    carteiraSaldo: 300.00
  },
  {
    id: "3",
    nome: "Carlos Lima",
    email: "carlos@email.com",
    nivel: "comum",
    carteiraSaldo: 45.00
  }
];

export const CUPONS_INICIAIS = [
  {
    id: "1",
    codigo: "GEEK10",
    descontoPorcentagem: 10,
    categoriaValida: "geek",
    ativo: true
  },
  {
    id: "2",
    codigo: "PROMO20",
    descontoPorcentagem: 20,
    categoriaValida: "perifericos",
    ativo: true
  },
  {
    id: "3",
    codigo: "EXVENCIDO",
    descontoPorcentagem: 50,
    categoriaValida: "livros",
    ativo: false
  }
];
