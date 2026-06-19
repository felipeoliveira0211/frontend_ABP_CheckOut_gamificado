# Falkon Geek Shop - Arquitetura, Decisões de Engenharia e Impacto de Negócio

Este documento apresenta as justificativas arquiteturais, as vantagens operacionais e os detalhes de implementação das tecnologias modernas de desenvolvimento de software adotadas no Falkon Geek Shop, focando em **React Router**, **Custom Hooks** e **Componentização avançada** utilizando JavaScript puro (ES6+ / React JSX) em vez de uma abordagem de código monolítico (espaguete).

---

## 1. Por que usamos Custom Hooks e Componentes em vez de Código Espaguete?

O desenvolvimento de aplicações web modernas exige que as interfaces sejam fáceis de entender, alterar e escalar. Centralizar toda a lógica de estado, cálculos complexos de desconto e renderização visual em um único arquivo (como o antigo `App.jsx` ou arquivos principais monolíticos) gera o chamado **"código espaguete"**, que traz graves riscos e ineficiências.

Nós decidimos separar estritamente a **Regra de Negócio** (Lógica) da **Apresentação Visual** (Interface de Usuário) por meio de três pilares:
1. **Contexto Reativo e Compartilhado** (`CartContext.jsx`)
2. **Custom Hooks Especializados** (`useCart.js`, `useCheckout.js`)
3. **Componentes Modulares Reutilizáveis** (como `ProductCard.jsx`, `DiscountWheel.jsx`)

### O impacto negativo do Código Espaguete na operação:
* **Frágil a alterações**: Mudar uma simples fórmula de cálculo de desconto poderia quebrar a renderização visual das páginas, gerando inconsistências no carrinho.
* **Gargalo para a Equipe**: Em um código espaguete, múltiplos desenvolvedores tentando trabalhar simultaneamente no mesmo arquivo causam conflitos de merge frequentes e desgastantes no controle de versão (Git/GitHub).
* **Dificuldade de Testes**: Seria quase impossível escrever testes unitários eficientes para as regras de cupons ou carrinho sem instanciar toda a árvore visual da aplicação.

---

## 2. Compreendendo o Impacto no Negócio e na Operação

Para um e-commerce de alta performance, a arquitetura de software de front-end se traduz diretamente em eficiência financeira e satisfação do cliente:

| Aspecto | Estratégia de Código Espaguete (Antiga) | Arquitetura Modular e Escalável (Adotada) | Impacto Real no Negócio (Business Value) |
| :--- | :--- | :--- | :--- |
| **Tempo de Lançamento (Time-to-Market)** | Lento. Implementar novos recursos exige reescrever ou adaptar centenas de linhas misturadas de código. | Rápido. Novas páginas, produtos ou promoções usam ganchos (`hooks`) e componentes prontos. | Permite à equipe de marketing lançar promoções sazonais (como Black Friday) em tempo recorde frente à concorrência. |
| **Erros de Cálculo de Desconto** | Altos. Centralizar cálculos de regras de cupons e a roleta reativa sem isolamento facilita a introdução de falhas humanas de precificação. | Nulos. Toda a matemática financeira é isolada em funções limpas e imutáveis dentro do Contexto e testadas isoladamente. | Evita prejuízos operacionais com cupons sendo aplicados incorretamente ou gerando fretes e preços negativos. |
| **Taxa de Conversão (UX/UI)** | Ruim. Atualizações de estado pesado em um único local re-renderizam a página inteira, causando lentidão ao digitar dados ou interagir. | Excelente. Renderizações são isoladas aos componentes reativos correspondentes (como `DiscountWheel` e `CouponValidationInfo`). | Interface de carregamento instantâneo e feedback imediato de cupons e descontos mantêm o usuário engajado, reduzindo o abandono de carrinho. |
| **Custo de Engenharia (Manutenção)** | Exponencial. Corrigir um bug consome horas de engenharia para depurar arquivos longos e complexos. | Linear e Previsível. Problemas visuais são resolvidos na pasta `/components`, problemas lógicos na de `/hooks`. | Reduz o custo operacional da equipe de TI, permitindo que os engenheiros foquem em novidades em vez de corrigir bugs legados repetitivos. |

---

## 3. Detalhamento e Mapeamento de Itens no Código

Todos os requisitos exigidos para um projeto moderno de alto nível foram implementados seguindo as melhores práticas do ecossistema JavaScript e React:

### A. React Router (Pelo menos 2 rotas a partir de uma rota base)
Em vez de alternar telas manualmente de forma improvisada, implementamos roteamento reativo baseado em histórico utilizando o `react-router-dom`. No arquivo `/src/App.jsx`, definimos um roteador com as seguintes rotas:
1. **Rota Base (`/`)**: Renderiza a tela `<CartPage />`, onde o catálogo de produtos geek (nas categorias periféricos, decoração e técnicos/literatura) é exibido com funcionalidade completa de filtragem, listagem e controle dinâmico do estoque remanescente.
2. **Rota de Finalização (`/checkout`)**: Renderiza a tela `<CheckoutPage />`, com o passo a passo completo de identificação, aplicação da roleta, validação em tempo real de cupons e fechamento fiscal das compras.

*Código de Exemplo Mapeado (`/src/App.jsx`):*
```jsx
<Routes>
  <Route path="/" element={<CartPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
</Routes>
```

---

### B. Custom Hooks (Isolamento de regras de negócio complexas)
Para garantir que a lógica do negócio não ficasse acoplada às telas, criamos ganchos personalizados na pasta `/src/hooks`:
1. **`useCart.js`**: Centraliza o controle do carrinho de compras. Gerencia a adição (verificando os limites de estoque reais do catálogo), a decrementação de quantidades, a remoção completa de itens e a limpeza integral do estado do carrinho.
2. **`useCheckout.js`**: Encapsula todas as regras exclusivas de precificação, cálculo de economia, verificação de elegibilidade de cupons pela categoria correta do item no carrinho e regulação do ganho na roleta interativa.

*Como isso despolui o componente:*
Nas telas (`CartPage.jsx` and `CheckoutPage.jsx`), os componentes simplesmente chamam funções do hook, como `removerItem(id)` ou `giraRoleta(valor)`, sem precisar saber exatamente como essas funções calculam internamente os totais.

---

### C. Componentização Reutilizável e Modulares
Substituímos o modelo de tela estática de checkout por componentes de alto valor, focados na facilidade de reutilização e na qualidade imaculada da interface:
1. **`ProductCard.jsx`**: Componente projetado para representar um produto de forma elegante com indicador de categoria, badge de estoque disponível com coloração em tempo real de baixa quantidade, preço formatado e botão síncrono de adição rápida.
2. **`DiscountWheel.jsx` (Roleta de Desconto)**: Componente que simula visualmente uma roleta de probabilidades calibradas com SVG e transições de curva de animação cubic-bezier sofisticadas por meio do `motion/react/`. Ele aplica buffs de desconto ao carrinho e se reconfigura para o modo pós-giro com efeito reativo para o usuário.
3. **`CouponValidationInfo.jsx` (Guia e Validação de Cupons)**: Exibe a listagem de todos os cupons, calculando automaticamente em tempo real se o cliente é elegível com base na análise matemática iterativa das categorias atualmente presentes no seu carrinho, oferecendo uma barra de status dinâmica e interativa (Elegível / Falta Categoria / Expirado).

---

## 4. Remoção de Dados Pré-Preenchidos do Cliente

Atendendo estritamente ao feedback do cliente em relação a dados pré-carregados na simulação de Checkout:
* Removemos dados estáticos como Nome, CPF, E-mail, Endereço e dados fiscais que vinham pré-carregados no formulário.
* Os layouts agora iniciam o formulário **totalmente limpo e neutro**.
* O botão de envio realiza uma **validação robusta em tempo real**. Se o usuário tentar finalizar a compra com algum campo em branco, o sistema impede a transação com um alerta nativo elegante na interface de usuário.

---
Com essa arquitetura robusta, o **Falkon Geek Shop** reduz significativamente a dívida técnica ao mesmo tempo em que oferece uma experiência de usuário ultrafluida nos maiores padrões comerciais do varejo eletrônico.
