# Markdown Docs Site — Specification

## Problem Statement

Equipes de desenvolvimento mantêm documentação em arquivos Markdown dentro de repositórios Git (GitHub, GitLab, etc.), mas essa documentação é pouco acessível para membros não-técnicos do time. Ler markdown cru é funcional para desenvolvedores, mas apresenta barreiras para product managers, designers e stakeholders que precisam consultar documentação funcional e técnica do projeto. A solução é transformar esses markdowns em um site estático de documentação rico e visualmente polido — inspirado na experiência da documentação da Stripe.

## Goals

- [ ] Gerar um site estático de documentação a partir de arquivos Markdown de um repositório Git
- [ ] Oferecer uma experiência visual premium com navegação intuitiva (sidebar, breadcrumbs, TOC)
- [ ] Suportar múltiplos providers Git (GitHub, GitLab, Bitbucket, etc.)
- [ ] Ser simples de configurar — um único arquivo de configuração define a fonte dos docs
- [ ] Funcionar como SSG (Static Site Generation) em Next.js para performance máxima

## Out of Scope

Explicitamente excluído. Documentado para prevenir scope creep.

| Feature                          | Reason                                                                 |
| -------------------------------- | ---------------------------------------------------------------------- |
| Editor de markdown in-browser    | O objetivo é leitura, não edição. Edição acontece no repositório       |
| Autenticação de usuários         | Site público/interno sem login. Auth de repo é apenas para fetch       |
| Sistema de comentários           | Fora do escopo inicial, pode ser feature futura                        |
| Deploy automatizado (CI/CD)      | O foco é o site em si, deploy é responsabilidade do usuário            |
| i18n / múltiplos idiomas         | Complexidade alta, pode ser feature futura                             |
| CMS ou painel admin              | Configuração via arquivo, sem interface administrativa                 |
| Versionamento de documentação    | Complexidade alta para MVP, pode ser feature futura                    |

---

## User Stories

### P1: Configuração da Fonte de Documentação ⭐ MVP

**User Story**: Como um desenvolvedor, eu quero configurar a fonte dos meus markdowns (repositório, branch, pasta) para que o site saiba de onde puxar a documentação.

**Why P1**: Sem configuração, não há como saber de onde buscar os markdowns. É o ponto de partida de todo o sistema.

**Acceptance Criteria**:

1. WHEN o desenvolvedor cria/edita um arquivo de configuração (ex: `docs.config.ts`) THEN o sistema SHALL reconhecer a URL do repositório, branch e path da pasta de docs
2. WHEN a configuração inclui credenciais de acesso (token) THEN o sistema SHALL usá-las para autenticar no provider Git
3. WHEN a configuração está inválida ou incompleta THEN o sistema SHALL exibir mensagem de erro clara no build indicando o que está faltando
4. WHEN nenhuma configuração é encontrada THEN o sistema SHALL buscar uma pasta `docs/` local no próprio projeto como fallback

**Independent Test**: Criar um `docs.config.ts` apontando para um repositório público do GitHub e verificar que o build reconhece os parâmetros.

---

### P1: Fetch de Markdown no Build Time ⭐ MVP

**User Story**: Como um desenvolvedor, eu quero que o sistema baixe os arquivos Markdown do repositório configurado durante o build para que o conteúdo esteja sempre atualizado.

**Why P1**: O fetch é o mecanismo central — sem ele, não há conteúdo para renderizar.

**Acceptance Criteria**:

1. WHEN o build é executado (`npm run build`) THEN o sistema SHALL fazer fetch dos arquivos `.md` do repositório/pasta configurada
2. WHEN o repositório é público THEN o sistema SHALL fazer fetch sem necessidade de token
3. WHEN o repositório é privado e um token válido está configurado THEN o sistema SHALL autenticar e fazer fetch com sucesso
4. WHEN o fetch falha (rede, auth, repo não encontrado) THEN o sistema SHALL exibir erro descritivo e falhar o build gracefully
5. WHEN existem arquivos que não são `.md` na pasta THEN o sistema SHALL ignorá-los

**Independent Test**: Executar `npm run build` apontando para um repositório público do GitHub com arquivos `.md` e verificar que os arquivos são baixados e processados.

---

### P1: Renderização de Markdown para HTML Rico ⭐ MVP

**User Story**: Como um leitor da documentação, eu quero ver os markdowns renderizados como páginas HTML ricas e bem formatadas para ter uma experiência de leitura agradável.

**Why P1**: A renderização é o valor central do produto — transformar markdown em documentação visual.

**Acceptance Criteria**:

1. WHEN um arquivo Markdown é processado THEN o sistema SHALL renderizar headings, parágrafos, listas, links, imagens, tabelas e blockquotes corretamente
2. WHEN o markdown contém blocos de código THEN o sistema SHALL renderizar com syntax highlighting e botão de copiar
3. WHEN o markdown contém frontmatter YAML THEN o sistema SHALL extrair `title`, `description` e `order` para metadados da página
4. WHEN o conteúdo é renderizado THEN o sistema SHALL aplicar tipografia premium com espaçamento generoso (inspiração Stripe)
5. WHEN a página é carregada THEN o sistema SHALL exibir um Table of Contents (TOC) lateral baseado nos headings do documento

**Independent Test**: Criar um markdown com headings, código, tabelas e imagens e verificar que todos os elementos são renderizados corretamente com estilo visual premium.

---

### P1: Navegação por Sidebar ⭐ MVP

**User Story**: Como um leitor da documentação, eu quero navegar entre as páginas usando uma sidebar lateral para encontrar facilmente o conteúdo que procuro.

**Why P1**: Navegação é essencial para qualquer site de documentação. Sem sidebar, o usuário se perde.

**Acceptance Criteria**:

1. WHEN o site é carregado THEN o sistema SHALL exibir uma sidebar à esquerda com a estrutura hierárquica dos documentos
2. WHEN a pasta de docs contém subpastas THEN o sistema SHALL renderizar como seções colapsáveis na sidebar
3. WHEN um item da sidebar é clicado THEN o sistema SHALL navegar para a página correspondente sem reload completo
4. WHEN a página atual está visível na sidebar THEN o sistema SHALL destacá-la visualmente (active state)
5. WHEN um arquivo contém frontmatter com `order` THEN o sistema SHALL respeitar essa ordem na sidebar; caso contrário, usar ordem alfabética
6. WHEN o arquivo se chama `index.md` THEN o sistema SHALL usá-lo como página principal da seção/pasta

**Independent Test**: Criar uma estrutura de docs com subpastas e verificar que a sidebar reflete a hierarquia com seções colapsáveis e navegação funcional.

---

### P1: Layout Geral com Header ⭐ MVP

**User Story**: Como um leitor da documentação, eu quero ver um header com o título do projeto e navegação principal para entender onde estou e navegar pelo site.

**Why P1**: O layout base define a experiência visual do site inteiro.

**Acceptance Criteria**:

1. WHEN o site é carregado THEN o sistema SHALL exibir um header fixo no topo com o nome/logo do projeto
2. WHEN o site é carregado THEN o sistema SHALL exibir o layout: header topo + sidebar esquerda + conteúdo central + TOC direita
3. WHEN o conteúdo é renderizado THEN o sistema SHALL exibir breadcrumbs acima do título da página
4. WHEN o header é visualizado THEN o sistema SHALL incluir um campo de busca (visual, sem funcionalidade no MVP)
5. WHEN o site é acessado em tela pequena (< 768px) THEN o sistema SHALL esconder a sidebar e oferecer um botão hamburger para abri-la

**Independent Test**: Abrir o site em desktop e mobile e verificar que o layout se adapta corretamente com header, sidebar e conteúdo.

---

### P1: Geração Estática (SSG) ⭐ MVP

**User Story**: Como um desenvolvedor, eu quero que o site seja gerado estaticamente para que funcione sem servidor e tenha carregamento instantâneo.

**Why P1**: SSG é o modelo de entrega — sem ele, não há site deployável.

**Acceptance Criteria**:

1. WHEN `npm run build` é executado THEN o sistema SHALL gerar páginas HTML estáticas para cada markdown
2. WHEN o build completa THEN o sistema SHALL produzir arquivos em `/out` prontos para deploy em qualquer hosting estático (Vercel, Netlify, S3, etc.)
3. WHEN uma página estática é carregada THEN o sistema SHALL ter tempo de carregamento < 1s para o First Contentful Paint
4. WHEN o site é navegado THEN o sistema SHALL usar client-side navigation para transições instantâneas entre páginas
5. WHEN as rotas são geradas THEN o sistema SHALL mapear a estrutura de pastas do docs para URL paths (ex: `docs/api/auth.md` → `/api/auth`)

**Independent Test**: Executar `npm run build` e verificar a pasta `/out` com arquivos HTML gerados. Servir com um server estático e validar carregamento.

---

### P2: Busca Full-Text

**User Story**: Como um leitor da documentação, eu quero buscar dentro de todo o conteúdo para encontrar informações rapidamente.

**Why P2**: Busca melhora drasticamente a usabilidade, mas o site funciona sem ela no MVP.

**Acceptance Criteria**:

1. WHEN o usuário digita no campo de busca THEN o sistema SHALL exibir resultados em tempo real com trechos do conteúdo matching
2. WHEN um resultado é clicado THEN o sistema SHALL navegar para a página e highlightar o trecho encontrado
3. WHEN a busca não retorna resultados THEN o sistema SHALL exibir estado vazio amigável

**Independent Test**: Digitar um termo que existe em algum markdown e verificar que os resultados aparecem corretamente.

---

### P2: Dark Mode

**User Story**: Como um leitor da documentação, eu quero alternar entre tema claro e escuro para conforto visual em diferentes ambientes.

**Why P2**: Dark mode é esperado em sites de documentação técnica, mas não bloqueia o uso.

**Acceptance Criteria**:

1. WHEN o site é carregado THEN o sistema SHALL detectar a preferência do sistema operacional e aplicar o tema correspondente
2. WHEN o usuário clica no toggle de tema THEN o sistema SHALL alternar entre dark/light mode
3. WHEN o tema é alterado THEN o sistema SHALL persistir a preferência no localStorage

**Independent Test**: Alternar entre dark e light mode e verificar que as cores mudam corretamente e persistem ao recarregar.

---

### P2: Navegação Anterior/Próximo

**User Story**: Como um leitor da documentação, eu quero navegar sequencialmente entre páginas usando botões "anterior" e "próximo" no final de cada página.

**Why P2**: Melhora a experiência de leitura linear, mas a sidebar já oferece navegação completa.

**Acceptance Criteria**:

1. WHEN o final de uma página é alcançado THEN o sistema SHALL exibir links de "Anterior" e "Próximo" baseados na ordem da sidebar
2. WHEN o usuário está na primeira página THEN o sistema SHALL esconder o link "Anterior"
3. WHEN o usuário está na última página THEN o sistema SHALL esconder o link "Próximo"

**Independent Test**: Navegar pela documentação usando apenas os links anterior/próximo e verificar a sequência correta.

---

### P3: Suporte a MDX (Componentes Customizados)

**User Story**: Como um autor de documentação, eu quero usar componentes especiais dentro do markdown (callouts, tabs, cards) para criar conteúdo mais rico.

**Why P3**: Enriquece o conteúdo mas adiciona complexidade significativa. Markdown puro já atende a maioria dos casos.

**Acceptance Criteria**:

1. WHEN um arquivo `.mdx` é encontrado THEN o sistema SHALL processá-lo com suporte a componentes React
2. WHEN o autor usa componentes como `<Callout>`, `<Tabs>` ou `<Card>` THEN o sistema SHALL renderizá-los com estilo visual consistente

**Independent Test**: Criar um arquivo `.mdx` com componentes customizados e verificar a renderização correta.

---

### P3: Docs Locais (Fallback sem Repositório)

**User Story**: Como um desenvolvedor, eu quero poder usar o sistema com markdowns locais (na pasta `docs/` do projeto) sem precisar configurar um repositório remoto.

**Why P3**: Simplifica o setup inicial e permite uso standalone.

**Acceptance Criteria**:

1. WHEN nenhuma configuração de repositório remoto existe THEN o sistema SHALL buscar markdowns na pasta `docs/` do projeto
2. WHEN a pasta `docs/` local existe e contém markdowns THEN o sistema SHALL processá-los identicamente aos remotos

**Independent Test**: Criar uma pasta `docs/` com markdowns e fazer build sem `docs.config.ts`. Verificar que o site é gerado corretamente.

---

## Edge Cases

- WHEN o repositório não contém nenhum arquivo `.md` THEN o sistema SHALL exibir página "No documentation found" com instruções
- WHEN um markdown contém links relativos para outros markdowns THEN o sistema SHALL resolver esses links para as rotas corretas do site
- WHEN um markdown referencia imagens locais do repositório THEN o sistema SHALL fazer fetch dessas imagens e servir localmente
- WHEN o markdown tem encoding diferente de UTF-8 THEN o sistema SHALL tentar detectar o encoding ou exibir aviso
- WHEN a estrutura de pastas é muito profunda (> 5 níveis) THEN o sistema SHALL limitar a navegação da sidebar a 4 níveis com collapse
- WHEN arquivos markdown muito grandes (> 500KB) são encontrados THEN o sistema SHALL processá-los normalmente mas com lazy loading do conteúdo
- WHEN o nome do arquivo contém caracteres especiais THEN o sistema SHALL sanitizar para criar URL slugs válidos

---

## Requirement Traceability

Cada requisito tem um ID único para rastreamento em design, tasks e validação.

| Requirement ID | Story                                 | Phase  | Status  |
| -------------- | ------------------------------------- | ------ | ------- |
| DOCS-01        | P1: Configuração da Fonte             | Specify | Verified |
| DOCS-02        | P1: Fetch de Markdown no Build Time   | Specify | Verified |
| DOCS-03        | P1: Renderização Markdown → HTML      | Specify | Verified |
| DOCS-04        | P1: Navegação por Sidebar             | Specify | Verified |
| DOCS-05        | P1: Layout Geral com Header           | Specify | Verified |
| DOCS-06        | P1: Geração Estática (SSG)            | Specify | Verified |
| DOCS-07        | P2: Busca Full-Text                   | Specify | Verified |
| DOCS-08        | P2: Dark Mode                         | Specify | Verified |
| DOCS-09        | P2: Navegação Anterior/Próximo        | Specify | Verified |
| DOCS-10        | P3: Suporte a MDX                     | Specify | Verified |
| DOCS-11        | P3: Docs Locais (Fallback)            | Specify | Verified |

**ID format:** `DOCS-[NUMBER]`

**Status values:** Pending → In Design → In Tasks → Implementing → Verified

**Coverage:** 11 total, 0 mapped to tasks, 11 unmapped ⚠️

---

## Success Criteria

Como sabemos que a feature foi bem-sucedida:

- [ ] Desenvolvedor configura repositório e gera site de docs funcional em < 5 minutos
- [ ] Leitor encontra e lê qualquer documento em < 3 cliques a partir da home
- [ ] Site tem carregamento < 1s (FCP) em hosting estático
- [ ] Visual é percebido como "premium" — comparável a docs da Stripe/Next.js
- [ ] Zero erros de renderização em markdown padrão (GFM)
