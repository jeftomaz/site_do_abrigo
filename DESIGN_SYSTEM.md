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

### Button · 🟡 rascunho

**Componente:** Button · **Status:** 🟡 rascunho
- **Anatomia:** elemento `<button>` nativo com spinner opcional à esquerda.
- **Variantes:** `primary` · `secondary` · `ghost` · `danger`
- **Tamanhos:** `sm` · `md` (default) · `lg`
- **Estados:** default · hover · active · `disabled` (opacidade 50%) · `isLoading` (spinner + desabilitado)
- **Responsivo:** sem diferença mobile × desktop por enquanto.
- **Tema:** variantes com classes `dark:` para cada estado — cores placeholder até tokens serem definidos.
- **Imagens de referência:** nenhuma ainda — cores são placeholders Tailwind.

### Componentes previstos (preencher progressivamente)

- [x] Button · 🟡
- [ ] Card (cão) · ⬜
- [ ] Modal / detalhe do cão · ⬜
- [ ] Field / input · ⬜
- [ ] Skeleton / loading · ⬜
- [ ] Header (âncoras + links) · ⬜
- [ ] Seção da landing · ⬜
- [ ] Card de história · ⬜
- [ ] Card de produto / número de rifa · ⬜
- [ ] Badge de status (disponível/adotado/reservado/pago) · ⬜
<!-- adicionar outros conforme surgirem -->

---

## 4. Registro de imagens

Toda imagem recebida entra aqui antes de virar token/componente. Evita perder contexto no volume.

| ID | Tela / componente | Viewport | Tema | Recebida | Traduzida p/ token | Notas |
|---|---|---|---|---|---|---|
| IMG-001 | — | — | — | ⬜ | ⬜ | — |

<!-- uma linha por imagem -->
