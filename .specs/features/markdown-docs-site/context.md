# Markdown Docs Site — Context

**Gathered:** 2026-03-28
**Spec:** `.specs/features/markdown-docs-site/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Gerar um site estático de documentação visualmente rico a partir de arquivos Markdown hospedados em repositórios Git remotos (GitHub, GitLab, etc.), com navegação estruturada, design customizável e output SSG via Next.js.

---

## Implementation Decisions

### 1. Organização do Conteúdo na Sidebar

- **Espelhar a estrutura de pastas do repositório remoto** — a árvore de diretórios do repo define automaticamente a hierarquia da sidebar
- Subpastas viram seções colapsáveis
- Arquivos `.md` viram itens de navegação
- `index.md` dentro de uma pasta vira a página da seção/grupo
- Ordem: respeitar frontmatter `order` quando presente, senão ordem alfabética
- Não haverá configuração manual da sidebar (sem `_sidebar.md` ou `nav` config)

### 2. Design Visual — Design System Customizável

- **O site terá um design system customizável via arquivo de configuração**
- O usuário poderá configurar: cores primárias, logo, nome do projeto, fontes, favicon
- O design base será inspirado na Stripe (layout sidebar + conteúdo + TOC, tipografia premium, espaçamento generoso) mas com identidade visual própria e configurável
- O config de tema ficará no mesmo `docs.config.ts` que define a fonte dos docs
- Deve ter um tema padrão bonito out-of-the-box — o config de tema é opcional, não obrigatório

### 3. Método de Fetch — Git REST API

- **Usar a API REST do provider Git** (GitHub API, GitLab API) para buscar arquivos no build time
- Sem necessidade de clonar o repositório
- Buscar a árvore de diretórios via API para montar a estrutura de navegação
- Buscar o conteúdo de cada arquivo `.md` individualmente via API
- Suportar autenticação via token (para repos privados)
- O provider será detectado automaticamente pela URL do repositório ou configurado explicitamente

### 4. Suporte a Markdown — GFM Completo

- **Suportar GitHub Flavored Markdown (GFM) completo** como baseline:
  - Tabelas
  - Checkboxes / task lists
  - Strikethrough
  - Autolinks
  - Blocos de código com syntax highlighting
  - Footnotes
  - Alerts / admonitions (GitHub-style: `> [!NOTE]`, `> [!WARNING]`, etc.)
  - Emojis
  - HTML inline básico
- **Arquitetura de renderização preparada para MDX no futuro** — o pipeline de processamento deve ser extensível
- No MVP, não suportar componentes React customizados — apenas GFM

### Agent's Discretion

- Escolha de bibliotecas de processamento de markdown (remark, rehype, unified, etc.)
- Implementação interna do cache de fetch para otimizar builds
- Estrutura interna de componentes React
- Estratégia de CSS (Tailwind já está no projeto — pode ser usado)

---

## Specific References

- **Stripe Docs** (https://docs.stripe.com) — referência principal de design:
  - Layout three-column: sidebar esquerda + conteúdo central + TOC direita
  - Tipografia sans-serif clean e premium
  - Espaçamento generoso entre seções
  - Sidebar com categorias em uppercase, itens com chevrons colapsáveis
  - Fundo claro, cores neutras com accent color sutil
  - Code blocks com syntax highlighting e botão copy
  - Breadcrumbs acima do título
  - Barra de busca centralizada no header

- **Next.js Docs** — referência secundária para estrutura de navegação

---

## Deferred Ideas

- **Suporte a MDX/componentes React** — arquitetura preparada no MVP, implementação como feature futura
- **Versionamento de docs** — possibilidade de múltiplas versões da documentação por branch/tag
- **Multi-repo** — agregar docs de múltiplos repositórios em um único site
- **i18n** — suporte a múltiplos idiomas
- **Sistema de comentários** — feedback inline na documentação
- **Deploy automatizado** — webhook para rebuild quando docs mudam no repo
