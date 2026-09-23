# Playbook: bootstrap de engenharia com IA (Spec Kit + AGENTS + IDE)

Documento **genérico e autocontido**. Não contém regras de domínio de nenhum produto — a IA deve preencher tudo a partir do workspace atual (ou do que o usuário definir, se o repo estiver vazio).

---

## Modos de uso

Escolha **um** modo e diga isso no prompt ao Agent.

### Modo A — Projeto existente (brownfield)

Há código, scripts, CI ou docs no repositório.

1. Copie **somente este arquivo** para a raiz ou `docs/`.
2. Abra o Agent na **raiz** do repo.
3. Peça para executar o playbook em **modo brownfield** (prompt abaixo).
4. A IA **analisa** o que já existe e **cria/adequa** os artefatos — mescla o que for útil; não apaga sem motivo.

### Modo B — Projeto novo (greenfield)

Repo vazio ou quase vazio (ainda sem app real, ou só scaffold inicial).

1. Copie este arquivo para a raiz ou `docs/`.
2. Informe no chat: nome do projeto, stack pretendida, estrutura de pastas, comandos planejados, como será o deploy, áreas críticas futuras, idioma do time.
3. Peça para executar em **modo greenfield**: a IA monta o kit com placeholders honestos e um `AGENTS.md` / constitution alinhados ao que você descreveu.
4. Quando o código existir de verdade, rode de novo em **modo brownfield** (ou peça “atualizar o kit com o repo atual”) para trocar placeholders por paths e comandos reais.

### Modo C — Só atualizar / readequar

O kit (`AGENTS.md`, `.specify/`, rules, etc.) já existe, mas ficou desatualizado.

1. Execute o playbook em **modo sync**: comparar Fase 0 com os artefatos atuais e corrigir gaps (comandos errados, globs mortos, constitution genérica demais, skills faltando).

---

## Prompts prontos

### Brownfield

```
Execute o playbook em MODO BROWNFIELD:
<path-para-este-arquivo>

Analise ESTE repositório e implemente/adeque o kit completo (Spec Kit, AGENTS.md,
.cursor/rules, pontes Claude/Copilot, gitignore, doc curta).
Não invente domínio de outro produto. Não faça commit sem eu pedir.
Ao final: liste arquivos e o que eu devo revisar.
```

### Greenfield

```
Execute o playbook em MODO GREENFIELD:
<path-para-este-arquivo>

Contexto do projeto:
- Nome: <nome>
- Stack: <ex.: Node/TS, Python, Go…>
- Apps/pastas previstas: <…>
- Comandos previstos: install / dev / test / build
- Deploy previsto: <…>
- Áreas críticas futuras: <ex.: auth, billing…>
- Idioma das respostas do Agent: português

Monte o kit completo com constitution e AGENTS.md coerentes com o contexto.
Use placeholders claros onde ainda não houver código.
Não faça commit sem eu pedir.
```

### Sync (já tem kit)

```
Execute o playbook em MODO SYNC:
<path-para-este-arquivo>

Compare o repo atual com AGENTS.md, constitution e .cursor/rules.
Atualize o que estiver desatualizado ou incompleto. Não faça commit sem eu pedir.
```

---

## Objetivo

Deixar o repositório com **descoberta automática** de padrões pela IDE:

| Artefato | Função |
|----------|--------|
| `AGENTS.md` | Instruções canônicas multi-agente |
| `.specify/` | Spec Kit (constitution, templates, scripts) |
| `.cursor/skills/speckit-*` | Skills `/speckit-specify`, etc. (Cursor) |
| `.cursor/rules/*.mdc` | Rules sempre ativas + por glob de domínio |
| `CLAUDE.md` | Ponte Claude Code → `AGENTS.md` |
| `.github/copilot-instructions.md` | Ponte GitHub Copilot → `AGENTS.md` |
| Doc curta (ex. `docs/engenharia-ia.md`) | Como humanos/IDE descobrem o fluxo |
| (Opcional) runner de testes + DoD | Se ainda não houver suite |

**Regra de ouro:** todo conteúdo específico (stack, paths, deploy, domínio) vem da **Fase 0** ou do **contexto greenfield** informado pelo usuário — nunca de outro repositório ou de memória de projetos anteriores.

---

## Fase 0 — Descoberta

### Brownfield / Sync

Explore o workspace e resuma ao usuário:

1. **Stack** — linguagens, package managers, monorepo?
2. **Entrypoints** — apps, `src/`, serviços, frontends.
3. **Comandos reais** — `package.json`, `Makefile`, `pyproject.toml`, CI, etc.
4. **Testes** — framework, comando, pastas.
5. **Deploy** — Docker, CI/CD, PaaS, K8s, docs existentes.
6. **Domínio crítico** — 1–5 paths onde erro custa caro (auth, pagamentos, regras de negócio, compliance…).
7. **Segurança** — secrets, `.env`, o que nunca commitar.
8. **Já existe?** — `AGENTS.md`, `.cursor/`, `.specify/`, `CLAUDE.md`, Copilot instructions.

Se algo já existir: **mesclar e aprimorar**.

### Greenfield

Não invente árvore de código. Use o **contexto do usuário**. Se faltar informação essencial (nome, stack, idioma), **pergunte antes** de criar arquivos. Marque no `AGENTS.md` seções como “a confirmar quando o código existir”.

### Idioma

Responda ao usuário no idioma pedido (padrão: português), salvo orientação contrária.

---

## Fase 1 — Spec Kit (infra genérica)

Igual em todos os modos.

### Preferência A — CLI oficial

```bash
# Ajuste à documentação atual:
# https://github.com/github/spec-kit
specify init --here --ai cursor-agent
```

Se a CLI não estiver disponível ou falhar → Preferência B.

### Preferência B — Estrutura mínima manual

```
.specify/
  memory/constitution.md
  templates/                 # spec, plan, tasks, checklist (upstream Spec Kit)
  scripts/bash/              # scripts upstream se possível; senão documentar fluxo manual
.cursor/skills/speckit-specify/SKILL.md
.cursor/skills/speckit-plan/SKILL.md
.cursor/skills/speckit-tasks/SKILL.md
.cursor/skills/speckit-implement/SKILL.md
# + clarify, analyze, checklist, constitution, converge, taskstoissues se disponíveis no upstream
```

Skills: obter do [Spec Kit](https://github.com/github/spec-kit) / integração `cursor-agent`. Não inventar o corpo das skills oficiais. Se não puder baixar, criar skills **mínimas** que descrevam specify → plan → tasks → implement e apontem para `.specify/templates/`.

`.gitignore` (versionar rules/skills):

```gitignore
.cursor/*
!.cursor/skills/
!.cursor/skills/**
!.cursor/rules/
!.cursor/rules/**
```

---

## Fase 2 — Constitution

Arquivo: `.specify/memory/constitution.md`

### Princípios (mantenha a ideia)

1. **Spec before code** — mudança de produto: specify → plan → tasks → implement  
2. **Testes no que importa** — regras de domínio com suite; comando real (ou previsto)  
3. **Segurança de produção** — secrets, processo oficial de deploy, Never list  
4. **Diffs pequenos** — PRs focados  
5. **Documentar o porquê** — docs quando o comportamento externo muda  

### Constraints (preencher com Fase 0 / contexto greenfield)

- Stack  
- Boundaries: **Always** / **Ask first** / **Never** (paths e práticas **deste** projeto)  
- Workflow e governança (versão da constitution)

Em greenfield, boundaries podem ser provisórias; em sync, alinhar com o código real.

---

## Fase 3 — `AGENTS.md`

Na **raiz** do repo:

```markdown
# AGENTS.md — <Nome do projeto>

## Visão do projeto
(1 parágrafo + mapa de pastas — real ou previsto)

## Comandos
(install, dev, test, build, lint — reais ou “previsto: …”)

## Deploy
(processo oficial; o que NÃO é produção)

## Spec Kit
/speckit-specify → plan → tasks → implement
Constitution: .specify/memory/constitution.md
Rules: .cursor/rules/
Pontes: CLAUDE.md, .github/copilot-instructions.md

## Convenções de código
(estilo do repo, layout de pastas, idioma das respostas ao usuário)

## Testes
(framework, o que cobrir, regra: mudar domínio → atualizar teste)

## Docs importantes
(tabela)

## Segurança / Never
(.env, force push em main, etc.)

## Definition of Done
- [ ] Spec/tasks se for mudança de produto
- [ ] Testes verdes (comando X) — ou N/A explícito
- [ ] Sem regressão óbvia nas áreas críticas
- [ ] Docs se o comportamento externo mudou
```

---

## Fase 4 — Cursor Rules

### 1) Core — `alwaysApply: true`

Ex.: `<projeto>-core.mdc`

- Aponta para `AGENTS.md` e constitution  
- Fluxo Spec Kit  
- Qualidade (testes, docs, secrets)  
- Idioma da resposta ao usuário  

### 2) Domínio — `alwaysApply: false` + `globs:`

Uma rule por área crítica. **Globs = paths reais** (brownfield) ou **previstos** (greenfield, com comentário de que devem ser revisados).

Exemplos genéricos (substituir pelos do projeto):

- `src/billing/**/*`, `**/auth/**/*`, `packages/core/**/*`

Conteúdo: onde está a fonte de verdade, o que não inventar, obrigação de teste.

### 3) Deploy — se houver processo claro

Globs típicos: `Dockerfile*`, `.github/workflows/**`, `docs/deploy.md`, manifests de IaC.  
Conteúdo: oficial vs local/dev.

Em greenfield sem deploy definido: criar só a rule core; adiar deploy-rule.

---

## Fase 5 — Pontes multi-IDE

### `CLAUDE.md`

```markdown
# Claude Code

Siga **AGENTS.md**.
Constitution: `.specify/memory/constitution.md`
```

### `.github/copilot-instructions.md`

- Fonte canônica: `AGENTS.md`  
- 5–10 bullets do resumo **deste** projeto  

### Doc humana (recomendada)

`docs/engenharia-ia.md` (ou equivalente): quem lê o quê, como a IDE carrega sozinha, fluxo Spec Kit, e **como reaplicar este playbook** (modos A/B/C). Link no `README.md`.

---

## Fase 6 — Testes

| Situação | Ação |
|----------|------|
| Já há runner | Documentar comando no `AGENTS.md` e no DoD |
| Não há, mas há lógica pura | Adicionar runner da stack + 1–2 testes do código existente |
| Greenfield sem código | Documentar comando **previsto**; não inventar suíte falsa |

Não criar testes de domínio que não existem neste repositório.

---

## Fase 7 — Verificação final

- [ ] `AGENTS.md` coerente com o modo (real vs previsto)  
- [ ] Constitution sem conteúdo de outro produto  
- [ ] Rule core presente; rules de domínio com globs válidos ou marcadas como provisórias  
- [ ] Skills Spec Kit ou fluxo documentado  
- [ ] `.gitignore` versiona skills/rules  
- [ ] `CLAUDE.md` + Copilot instructions  
- [ ] README aponta para a doc de engenharia IA  
- [ ] Testes: verdes, N/A, ou comando previsto explícito  
- [ ] Nenhum secret commitado  

Reportar ao usuário:

1. Arquivos criados/alterados  
2. Modo usado (brownfield / greenfield / sync)  
3. Uso no dia a dia (`/speckit-specify`, abrir pela raiz)  
4. O que revisar (Always / Ask first / Never; globs provisórios)

**Não** commit/push sem pedido explícito.

---

## Como seguir o kit no dia a dia (depois do bootstrap)

Válido para projetos novos e existentes, uma vez o kit instalado:

1. Abrir o repositório pela **raiz** (onde está `AGENTS.md`).
2. Features / mudança de comportamento:  
   `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`
3. A IDE (Cursor) carrega rules + skills; Claude/Copilot leem as pontes → `AGENTS.md`.
4. Antes de considerar pronto: DoD do `AGENTS.md` (testes, docs).
5. Se a estrutura do repo mudar bastante: rode de novo o **Modo C (sync)**.

---

## Anti-padrões

- Copiar rules, constitution ou testes de **outro** produto/repositório  
- `AGENTS.md` vago (“escreva código limpo”) sem comandos/paths  
- Rules demais; prefira 1 core + poucas por domínio  
- Globs que não batem com nenhuma pasta do repo (em brownfield)  
- Tratar ambiente local como produção se existir fluxo oficial documentado  
- Em greenfield: inventar árvore de código ou domínio não pedido pelo usuário  

---

## Referências

- Spec Kit: https://github.com/github/spec-kit  
- Projetos existentes: https://github.com/github/spec-kit/blob/main/docs/guides/existing-projects.md  
- AGENTS.md: https://agents.md/  

**Versão:** 1.1.0 · Genérico · Modos: brownfield | greenfield | sync
