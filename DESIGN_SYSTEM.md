# DESIGN_SYSTEM.md

Fonte da verdade visual. Preenchido **progressivamente** conforme as imagens (Photoshop) chegam.
Os tokens aqui devem espelhar `tailwind.config`. Se divergirem, este documento descreve a *intenção*; o config é a implementação.

## Como usar

- Cada bloco tem um **status**: `⬜ pendente` · `🟡 rascunho` · `🟢 confirmado`.
- Agentes: **não inventem** valores. Se um token está `⬜`, peça a imagem ou pergunte. Não chute hex, espaçamento ou comportamento.
- Toda imagem recebida é registrada na tabela **Registro de imagens** no fim do arquivo antes de virar token.

## Eixos de variação

Todo componente/token pode variar em até 3 eixos. Sempre identifique qual variação a imagem representa.

- **Viewport:** `mobile` (base, mobile-first) · `desktop`
- **Tema:** `light` · `dark`
- **Estado:** default · hover · focus · active · disabled · loading

---

## 1. Tokens

### 1.1 Cores · ⬜ pendente

Definir por **papel semântico**, não por cor literal (`bg-surface`, não `bg-white`). Isso faz light/dark "só funcionarem".

| Token | Papel | Light | Dark |
|---|---|---|---|
| `bg-base` | fundo da página | — | — |
| `bg-surface` | cards, modais | — | — |
| `text-primary` | texto principal | — | — |
| `text-muted` | texto secundário | — | — |
| `brand` | cor da marca | — | — |
| `accent` | destaque/CTA | — | — |
| `border` | bordas/divisores | — | — |
| `success` / `warning` / `danger` | status | — | — |

<!-- preencher a partir das imagens -->

### 1.2 Tipografia · ⬜ pendente

| | Valor |
|---|---|
| Família display | — |
| Família texto | — |
| Escala (xs…3xl) | — |
| Pesos | — |
| Altura de linha | — |

### 1.3 Espaçamento · ⬜ pendente

Escala base (ex.: 4px). Listar tokens `space-1…space-N`. <!-- preencher -->

### 1.4 Raios de borda · ⬜ pendente

`radius-sm/md/lg/full`. <!-- preencher -->

### 1.5 Sombras · ⬜ pendente

Variam por tema. `shadow-sm/md/lg` em light e dark. <!-- preencher -->

### 1.6 Breakpoints · ⬜ pendente

| Nome | Min-width |
|---|---|
| `mobile` (base) | 0 |
| `desktop` | — |
<!-- confirmar valores quando vierem os modelos desktop -->

### 1.7 Animações / transições · ⬜ pendente

Durações, easings, e onde se aplicam (hover de card, abrir modal, etc.). <!-- preencher -->

---

## 2. Princípios · 🟡 rascunho

- **Mobile-first.** Estilizar base p/ mobile; `desktop:` adiciona.
- **Implementação CSS:** Tailwind CSS. Tokens confirmados devem ser espelhados em `tailwind.config`.
- **Dark mode** via classe na raiz (`html.dark`) + tokens semânticos. Nunca cor hardcoded em componente.
- **Sem estilo solto.** Cor/espaço/raio sempre via token. Valor "mágico" no JSX é bug.
- **Responsivo F6-02:** botões/campos têm altura mínima tocável; páginas reduzem padding vertical no mobile; CTAs ocupam largura total no mobile e largura natural a partir de `sm`; tabelas admin usam `overflow-x-auto` com `min-width`; modais encostam no rodapé em mobile, centralizam em `sm+` e limitam altura com scroll interno.
- **Dark mode F6-03:** `html`, `body` e `#root` definem fundo/texto base light/dark; superfícies usam `bg-white`/`dark:bg-gray-900`, campos usam `dark:bg-gray-800` e textos secundários usam `dark:text-gray-400` até tokens finais existirem.
- **SEO/brand asset F6-04:** favicon SVG usa azul placeholder `#2563eb` e coração com rosto simples; substituir quando houver marca final.

---

## 3. Catálogo de componentes

Um bloco por componente. Modelo a seguir; duplicar conforme as imagens chegam.

### Modelo (copiar para cada componente)

> **Componente:** Nome · **Status:** ⬜
> - **Anatomia:** partes que o compõem.
> - **Variantes:** primary/secondary/ghost… (conforme imagens).
> - **Estados:** default · hover · focus · active · disabled · loading — descrever cada.
> - **Responsivo:** diferenças mobile × desktop.
> - **Tema:** diferenças light × dark.
> - **Imagens de referência:** IDs do Registro abaixo.

### Favicon / app icon · 🟡 rascunho

**Componente:** `public/favicon.svg` · **Status:** 🟡 rascunho
- **Anatomia:** quadrado azul com cantos arredondados, coração branco e rosto simples.
- **Variantes:** favicon SVG único, reaproveitado pelo manifest.
- **Estados:** não aplicável.
- **Responsivo:** renderiza como ícone pequeno de navegador/app.
- **Tema:** não varia por tema; usa cor de marca placeholder.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Button · 🟡 rascunho

**Componente:** Button · **Status:** 🟡 rascunho
- **Anatomia:** elemento `<button>` nativo com spinner opcional à esquerda.
- **Variantes:** `primary` · `secondary` · `ghost` · `danger`
- **Tamanhos:** `sm` · `md` (default) · `lg`
- **Estados:** default · hover · active · `disabled` (opacidade 50%) · `isLoading` (spinner + desabilitado)
- **Responsivo:** altura mínima tocável (`sm` 36px, `md` 40px, `lg` 48px); CTAs podem receber `w-full sm:w-auto` quando usados em formulários/landing.
- **Tema:** variantes com classes `dark:` para cada estado — cores placeholder até tokens serem definidos.
- **Imagens de referência:** nenhuma ainda — cores são placeholders Tailwind.

### Card (cão) · 🟡 rascunho

**Componente:** DogCard · **Status:** 🟡 rascunho
- **Anatomia:** imagem de capa (aspect 4/3, `object-cover`; fallback 🐾 quando sem foto) + nome + linha meta (`porte · idade`).
- **Variantes:** estático (público, F3-05) · clicável (recebe `onClick` → abre detalhe na F3-06, com `role/tabIndex`, hover de sombra e foco visível).
- **Estados:** default · hover (sombra) · focus-visible (ring) quando clicável.
- **Responsivo:** card fluido; grid da página é 1 col (mobile) → 2 (sm) → 3 (lg).
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Modal / detalhe do cão · 🟡 rascunho

**Componente:** DogDetailsModal · **Status:** 🟡 rascunho
- **Anatomia:** `Modal` compartilhado com título do cão, imagem principal/fallback, linha meta (`porte · idade`), descrição e CTA para formulário de adoção.
- **Variantes:** com URL `VITE_ADOPTION_FORM_URL` (CTA abre Google Forms em nova aba) · sem URL (CTA desabilitado).
- **Estados:** aberto · fechado; fechamento por Esc, backdrop e botão do `Modal`.
- **Responsivo:** conteúdo em coluna única; CTA ocupa largura total no mobile e largura automática em telas maiores.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Formulário admin de cão · 🟡 rascunho

**Componente:** DogCreateForm / DogEditModal / DogFormFields / DogPhotoUpload / StatusSelect · **Status:** 🟡 rascunho
- **Anatomia:** campos nome, porte, idade aproximada e descrição; seção de fotos com miniaturas, input de arquivo e botão de upload; badge + select de status na tabela; botão `Button` com loading; mensagens de erro/sucesso.
- **Variantes:** criação em bloco fixo na página admin · edição em `Modal` compartilhado aberto pela tabela; upload de fotos apenas na edição; status editável direto na tabela.
- **Estados:** default · validação de campo · erro de submit · sucesso no cadastro · upload loading/erro · loading no botão.
- **Responsivo:** campos em grid 1 coluna no mobile → 2 colunas no desktop quando houver espaço; miniaturas em grid compacto; modal mantém largura compacta.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Modal compartilhado · 🟡 rascunho

**Componente:** Modal · **Status:** 🟡 rascunho
- **Anatomia:** backdrop fixo, dialog, cabeçalho opcional com título/botão fechar, conteúdo rolável e rodapé opcional.
- **Variantes:** com título/rodapé · sem título/rodapé.
- **Estados:** aberto · fechado; fechamento por Esc, backdrop e botão `Fechar`.
- **Acessibilidade:** `role="dialog"`, `aria-modal`, `aria-labelledby` quando há título; ao abrir, move foco para o primeiro controle ou para o dialog, mantém Tab/Shift+Tab dentro do modal e restaura o foco anterior ao fechar.
- **Responsivo:** mobile usa folha inferior (`items-end`, `rounded-t-xl`, sem padding externo); `sm+` centraliza com padding externo. Altura limitada a `100dvh` no mobile e `calc(100dvh - 2rem)` em `sm+`, com scroll apenas no conteúdo.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Field / input · 🟡 rascunho

**Componente:** Field · **Status:** 🟡 rascunho
- **Anatomia:** label, input ou textarea, hint opcional e erro opcional.
- **Variantes:** `input` · `textarea`.
- **Estados:** default · focus · erro.
- **Acessibilidade:** label sempre associado; hint e erro são ligados ao campo via `aria-describedby`, e erro marca `aria-invalid`.
- **Responsivo:** largura fluida e altura mínima de 40px nos inputs; grids de formulário permanecem 1 coluna no mobile e passam a 2 colunas em `sm/md+` conforme o formulário.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Telas de autenticação · 🟡 rascunho

**Componente:** LoginPage / EnrollTOTPPage / VerifyTOTPPage / SetPasswordPage · **Status:** 🟡 rascunho
- **Anatomia:** shell centralizado, card de formulário, título, texto auxiliar, campos, erro e botão submit.
- **Variantes:** login, enrolar TOTP, verificar TOTP e definir senha; TOTP usa campo centralizado com tracking largo.
- **Estados:** default, erro, loading e disabled no botão.
- **Acessibilidade:** inputs têm labels visíveis; mensagens de erro são associadas aos campos do formulário por `aria-describedby`.
- **Responsivo:** card fluido até `max-w-sm`, padding compacto no mobile e `sm:p-8` em telas maiores.
- **Tema:** classes compartilhadas em `authStyles.ts`; shell usa `dark:bg-gray-950`, card `dark:bg-gray-900`, campos `dark:bg-gray-800`, textos `dark:text-gray-100/400`, erro `dark:text-red-400` e submit `dark:bg-blue-500`.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Badge / controle de status · 🟡 rascunho

**Componente:** StatusBadge / StatusSelect · **Status:** 🟡 rascunho
- **Anatomia:** badge textual colorido para leitura rápida + select de status para admin.
- **Variantes:** `available` (Disponível) · `adopted` (Adotado) · `deceased` (Falecido).
- **Estados:** default · loading/disabled ao salvar · erro inline quando a mudança falha.
- **Responsivo:** usado dentro da tabela admin; largura mínima para evitar quebra do select.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Skeleton / loading · 🟡 rascunho

**Componente:** Skeleton / SkeletonCard / SkeletonRows / PageLoadingFallback · **Status:** 🟡 rascunho
- **Anatomia:** bloco base com `animate-pulse`; `SkeletonCard` para cards públicos; `SkeletonRows` para tabelas/listas admin; `PageLoadingFallback` para rotas lazy/guard com texto `role="status"` e linhas skeleton.
- **Variantes:** card · linhas · fallback de página.
- **Estados:** loading; skeletons decorativos ficam com `aria-hidden`, enquanto o fallback de página expõe texto de status.
- **Responsivo:** usa largura fluida do container; o layout de grid/lista é definido pela página que o contém.
- **Tema:** light/dark via classes placeholder (`gray-200`/`gray-700`) até tokens serem definidos.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### StateMessage · 🟡 rascunho

**Componente:** StateMessage · **Status:** 🟡 rascunho
- **Anatomia:** caixa com borda, texto e título opcional.
- **Variantes:** `empty` · `error` · `info`.
- **Estados:** mensagens de erro usam `role="alert"`; mensagens vazias/informativas não anunciam alerta.
- **Responsivo:** largura fluida do container, padding fixo compacto.
- **Tema:** light/dark via classes placeholder; `error` usa tons vermelhos, `info` tons azuis, `empty` superfície neutra.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Card de evento · 🟡 rascunho

**Componente:** EventCard · **Status:** 🟡 rascunho
- **Anatomia:** selos de status/tipo, título do evento, período formatado e descrição opcional.
- **Variantes:** ativo (`Evento ativo`) · passado (`Encerrado`); tipo `Rifa` ou `Produtos`.
- **Estados:** default; loading/erro/vazio são tratados pela página pública `/eventos` com `SkeletonCard` e mensagens inline.
- **Responsivo:** card fluido; lista de passados usa 1 coluna no mobile e 2 colunas em telas médias.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Painel de reserva de evento · 🟡 rascunho

**Componente:** EventReservationPanel · **Status:** 🟡 rascunho
- **Anatomia:** título, aviso de prazo, lista de produtos ou números livres, campos Nome/Contato, botão Reservar, confirmação com chave PIX e prazo do comprovante.
- **Variantes:** evento de produtos (cards com nome/preço/descrição) · evento de rifa (grade compacta de números).
- **Estados:** loading com `SkeletonCard`; erro inline; vazio para itens/números indisponíveis; item selecionado; submitting; sucesso com botão de copiar PIX.
- **Responsivo:** produtos em 1 coluna no mobile e 2 em telas maiores; números em grid compacto progressivo.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Formulário admin de evento · 🟡 rascunho

**Componente:** EventCreateForm / EventEditModal / EventFormFields · **Status:** 🟡 rascunho
- **Anatomia:** campos título, tipo, prazo da reserva em horas, início, encerramento, descrição e checkbox de evento ativo; tabela admin com badge de status, tipo, período, prazo e ação de edição.
- **Variantes:** criação em bloco fixo na página admin · edição em `Modal` compartilhado aberto pela tabela.
- **Estados:** default · validação de campo/data · erro de submit · sucesso no cadastro · loading no botão.
- **Responsivo:** formulário em 1 coluna no mobile, pares de campos em 2 colunas em telas maiores; tabela com overflow horizontal.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Painel admin de itens de evento · 🟡 rascunho

**Componente:** EventItemsPanel / ProductCreateForm / ProductEditModal / RaffleNumberCreateForm / RaffleNumberEditModal · **Status:** 🟡 rascunho
- **Anatomia:** ação `Itens` na tabela de eventos; painel contextual com título do evento, formulário de criação, tabela de itens e modais de edição.
- **Variantes:** produtos com nome, preço, descrição e ordem · números de rifa com número, rótulo e ordem.
- **Estados:** loading com skeleton, erro inline, vazio, sucesso no cadastro, validação de campos e loading no botão.
- **Responsivo:** painel full-width abaixo da tabela; tabelas com overflow horizontal; formulários em 1 coluna no mobile e 2 colunas para campos curtos em telas maiores.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Painel admin de reservas · 🟡 rascunho

**Componente:** EventReservationsPanel / ReservationStatusControl · **Status:** 🟡 rascunho
- **Anatomia:** ação `Reservas` na tabela de eventos; painel contextual com título do evento, prazo padrão, tabela de reservas, badge de status, select de status e atalho `Pago`.
- **Variantes:** reserva de produto · reserva de número de rifa; status `pending`, `paid`, `cancelled`.
- **Estados:** loading com skeleton, erro inline, vazio, status salvando/desabilitado e erro de mutation.
- **Responsivo:** painel full-width abaixo da tabela; tabela com overflow horizontal e controles compactos por linha.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Header · 🟡 rascunho

**Componente:** Header · **Status:** 🟡 rascunho
- **Anatomia:** marca, navegação desktop, alternância de tema e menu mobile.
- **Variantes:** desktop com links inline · mobile com menu colapsável.
- **Estados:** menu fechado/aberto; botão de tema alterna label claro/escuro.
- **Acessibilidade:** inclui link "Pular para o conteúdo" apontando para `#main-content`; botão mobile usa `aria-expanded`/`aria-controls`; links e botões têm foco visível.
- **Responsivo:** links inline aparecem em `sm+`; mobile usa botão de 40px com `aria-expanded` e links de 40px de altura mínima.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Seções da landing · 🟡 rascunho

**Componente:** DoacaoSection / AdocaoSection / HistoriasSection / EventosSection · **Status:** 🟡 rascunho
- **Anatomia:** seção vertical, container central e CTA; doação inclui caixa PIX.
- **Variantes:** seção informativa com CTA · seção PIX copiável.
- **Estados:** botão de copiar mostra `Copiado!`.
- **Responsivo:** padding vertical menor no mobile; CTAs ocupam largura total no mobile e largura natural em `sm+`; chave PIX quebra linha sem overflow.
- **Tema:** dark via classes `dark:`; cores placeholder até tokens.
- **Imagens de referência:** nenhuma ainda — estilo é placeholder.

### Componentes previstos (preencher progressivamente)

- [x] Button · 🟡
- [x] Favicon / app icon · 🟡
- [x] Card (cão) · 🟡
- [x] Modal / detalhe do cão · 🟡
- [x] Formulário admin de cão · 🟡
- [x] Field / input · 🟡
- [x] Telas de autenticação · 🟡
- [x] Skeleton / loading · 🟡
- [x] StateMessage · 🟡
- [x] Header (âncoras + links) · 🟡
- [x] Seção da landing · 🟡
- [ ] Card de história · ⬜
- [x] Card de evento · 🟡
- [x] Painel de reserva de evento · 🟡
- [x] Formulário admin de evento · 🟡
- [x] Painel admin de itens de evento · 🟡
- [x] Painel admin de reservas · 🟡
- [x] Card de produto / número de rifa · 🟡
- [x] Badge de status (disponível/adotado/falecido) · 🟡
<!-- adicionar outros conforme surgirem -->

---

## 4. Registro de imagens

Toda imagem recebida entra aqui antes de virar token/componente. Evita perder contexto no volume.

| ID | Tela / componente | Viewport | Tema | Recebida | Traduzida p/ token | Notas |
|---|---|---|---|---|---|---|
| IMG-001 | — | — | — | ⬜ | ⬜ | — |

<!-- uma linha por imagem -->
