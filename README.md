# Playbook: bootstrap de engenharia com IA (Spec Kit + AGENTS + IDE)

> **Como usar em um projeto novo**
>
> 1. Copie **somente este arquivo** para a raiz (ou `docs/`) do repositório destino.
> 2. Abra o chat do Agent (Cursor, Claude Code, Copilot Agent, etc.) na **raiz** do repo.
> 3. Envie: *“Siga o playbook em `<caminho-deste-arquivo>`: analise o projeto e implemente o kit completo.”*
> 4. A IA deve **avaliar o código existente** e **criar/adequar** os artefatos — não copiar conteúdo de domínio de outro produto.

Este documento é a fonte de verdade do bootstrap. Ignore memórias de outros repositórios; use apenas o que existir **neste** workspace.

---

## Objetivo

Deixar o repositório com descoberta automática de padrões pela IDE:

| Artefato | Função |
|----------|--------|
| `AGENTS.md` | Instruções canônicas multi-agente |
| `.specify/` | Spec Kit (constitution, templates, scripts) |
| `.cursor/skills/speckit-*` | Skills `/speckit-specify`, etc. (Cursor) |
| `.cursor/rules/*.mdc` | Rules sempre ativas + por glob de domínio |
| `CLAUDE.md` | Ponte Claude Code → `AGENTS.md` |
| `.github/copilot-instructions.md` | Ponte GitHub Copilot → `AGENTS.md` |
| Doc curta (ex. `docs/engenharia-ia.md`) | Como humanos/IDE descobrem o fluxo |
| (Opcional) runner de testes + DoD | Se o projeto ainda não tiver suite |

**Não** inventar regras de negócio de outro produto (ex.: FRAT, aviação). Tudo específico deve sair da análise **deste** repo.

---

## Fase 0 — Descoberta (obrigatória antes de escrever arquivos)

Explore o workspace e registre mentalmente (ou em um resumo curto ao usuário):

1. **Stack**: linguagens, package managers, monorepo?
2. **Entrypoints**: apps, `src/`, serviços, frontends.
3. **Comandos reais**: scripts em `package.json` / `Makefile` / `pyproject` / CI.
4. **Testes**: framework existente? Comando? Pastas?
5. **Deploy**: Dockerfile, Cloud Build, Vercel, K8s, docs de deploy?
6. **Domínio crítico**: módulos onde erro custa caro (pagamentos, auth, score, compliance…). Liste 1–5 paths.
7. **Segurança**: `.env`, secrets, o que nunca commitar.
8. **Já existe** `AGENTS.md`, `.cursor/`, `.specify/`, `CLAUDE.md`, Copilot instructions?

Se algo já existir: **mesclar e aprimorar**, não apagar sem motivo. Preserve conteúdo válido do projeto.

Responda ao usuário em português (salvo se o repo for claramente EN-only e o time pedir inglês).

---

## Fase 1 — Spec Kit (infra genérica)

### Preferência A — CLI oficial (se rede/ferramentas permitirem)

```bash
# Exemplo (ajuste à doc atual do Spec Kit):
# https://github.com/github/spec-kit
specify init --here --ai cursor-agent
```

Se a CLI não estiver disponível ou falhar → **Preferência B**.

### Preferência B — Estrutura mínima manual

Criar (se não existir):

```
.specify/
  memory/constitution.md          # preenchido na Fase 2
  templates/                      # spec, plan, tasks, checklist (pode copiar do Spec Kit upstream)
  scripts/bash/                   # se possível: scripts do Spec Kit; senão documentar fluxo manual
.cursor/skills/speckit-specify/SKILL.md
.cursor/skills/speckit-plan/SKILL.md
.cursor/skills/speckit-tasks/SKILL.md
.cursor/skills/speckit-implement/SKILL.md
# + clarify, analyze, checklist, constitution, converge, taskstoissues se disponível no upstream
```

Skills: obter do [github/spec-kit](https://github.com/github/spec-kit) / integração `cursor-agent`, **não** inventar o conteúdo das skills. Se não puder baixar, criar skills mínimas que descrevam o fluxo specify → plan → tasks → implement e apontem para `.specify/templates/`.

Atualizar `.gitignore`:

```gitignore
.cursor/*
!.cursor/skills/
!.cursor/skills/**
!.cursor/rules/
!.cursor/rules/**
```

(Não ignore o restante do que o time precisar versionar.)

---

## Fase 2 — Constitution (específica deste projeto)

Escrever `.specify/memory/constitution.md` com:

### Princípios estáveis (mantenha a ideia)

1. **Spec before code** — mudança de produto: specify → plan → tasks → implement  
2. **Testes no que importa** — regras de domínio com suite; comando real do projeto  
3. **Segurança de produção** — secrets, deploy oficial, o que nunca fazer  
4. **Diffs pequenos** — PRs focados  
5. **Documentar o porquê** — `docs/` quando comportamento externo muda  

### Constraints (preencher com a Fase 0)

- Stack real  
- Boundaries: Always / Ask first / Never (paths e práticas **deste** repo)  
- Workflow de desenvolvimento e governança (versão da constitution)

Não copie boundaries de outro produto.

---

## Fase 3 — `AGENTS.md` (canônico)

Criar/atualizar na **raiz**:

```markdown
# AGENTS.md — <Nome do projeto>

## Visão do projeto
(1 parágrafo + mapa de pastas)

## Comandos
(blocos copy-paste: install, dev, test, build, lint)

## Deploy
(link ou resumo do processo oficial; o que NÃO é produção)

## Spec Kit
/speckit-specify → plan → tasks → implement
Constitution: .specify/memory/constitution.md
Rules: .cursor/rules/
Pontes: CLAUDE.md, .github/copilot-instructions.md

## Convenções de código
(ESM, pastas de flows/services, idioma das respostas ao usuário, etc.)

## Testes
(framework, o que cobrir, regra: mudar domínio → atualizar teste)

## Docs importantes
(tabela)

## Segurança / Never
(.env, force push, etc.)

## Definition of Done
- [ ] Spec/tasks se for produto
- [ ] Testes verdes (comando X)
- [ ] Sem regressão óbvia nas áreas críticas listadas
- [ ] Docs se comportamento externo mudou
```

Tudo baseado na Fase 0.

---

## Fase 4 — Cursor Rules

Criar `.cursor/rules/`:

### 1) Core — `alwaysApply: true`

Ex.: `<projeto>-core.mdc`

- Apontar para `AGENTS.md` e constitution  
- Fluxo Spec Kit  
- Qualidade (testes, docs, secrets)  
- Idioma da resposta ao usuário  

### 2) Domínio — `alwaysApply: false` + `globs:`

Uma rule por área crítica descoberta na Fase 0. Exemplos de globs:

- `src/billing/**/*.ts,src/payments/**/*`
- `**/auth/**/*`
- Paths reais do repo

Conteúdo: onde mora a verdade (arquivos), o que não inventar, obrigação de teste.

### 3) Deploy — se houver processo claro

Globs: `Dockerfile*`, `cloudbuild.yaml`, `.github/workflows/**`, `docs/deploy.md`, etc.  
Conteúdo: processo oficial vs local.

---

## Fase 5 — Pontes multi-IDE

### `CLAUDE.md` (raiz)

```markdown
# Claude Code

Siga **AGENTS.md**.
Constitution: `.specify/memory/constitution.md`
```

### `.github/copilot-instructions.md`

- Fonte canônica: `AGENTS.md`  
- 5–10 bullets do resumo obrigatório (deste projeto)  

### Doc humana (opcional mas recomendada)

`docs/engenharia-ia.md` (ou nome equivalente): tabela “quem lê o quê” + “como a IDE pega sozinha” + fluxo Spec Kit. Linkar no `README.md`.

---

## Fase 6 — Testes (só se fizer sentido)

Se **não** houver runner:

- Adicionar o padrão da stack (ex. Vitest/Jest/pytest) com config mínima  
- 1–2 testes de **lógica pura** já existente (não inventar features)  
- Scripts `test` / `test:watch` nos manifests  

Se **já** houver: só documentar o comando no `AGENTS.md` e exigir no DoD.

Não criar testes FRAT/domínio alheio.

---

## Fase 7 — Verificação final

Checklist do agente (marcar mentalmente e reportar ao usuário):

- [ ] `AGENTS.md` reflete este repo (comandos testados ou lidos do package/Makefile)  
- [ ] Constitution sem referências a outro produto  
- [ ] Rules core + ≥1 rule de domínio com globs corretos (se houver domínio crítico)  
- [ ] Skills Spec Kit presentes ou fluxo documentado  
- [ ] `.gitignore` versiona skills/rules  
- [ ] `CLAUDE.md` + Copilot instructions  
- [ ] README aponta para a doc de engenharia IA  
- [ ] `npm test` / equivalente: verde ou “não aplicável ainda” explícito  
- [ ] Nenhum secret commitado  

Ao terminar, mostre ao usuário:

1. Lista de arquivos criados/alterados  
2. Como usar no dia a dia (`/speckit-specify`, abrir pela raiz)  
3. O que ele deve revisar (boundaries Always/Ask/Never)

**Não** faça commit/push a menos que o usuário peça.

---

## Prompt pronto (colar no Agent)

```
Leia e execute o playbook neste repositório:
<path-para-este-arquivo>

1) Analise o projeto (stack, comandos, testes, deploy, domínio crítico).
2) Implemente Spec Kit + AGENTS.md + .cursor/rules + pontes Claude/Copilot.
3) Adeque tudo a ESTE código — não copie regras de outro produto.
4) Atualize .gitignore e um doc curto de como a IDE descobre os padrões.
5) Ao final, liste arquivos e o que eu devo revisar. Não commit sem eu pedir.
```

---

## Anti-padrões

- Colar `frat-domain.mdc`, mitigações de voo, Cloud Build de outro cliente  
- `AGENTS.md` genérico vazio (“escreva código limpo”) sem comandos/paths reais  
- Ignorar stack monorepo e colocar rules só na pasta errada  
- Tratar Docker local como produção se o repo tiver outro fluxo oficial  
- Criar dezenas de rules; prefira 1 core + poucas por domínio  

---

## Referências

- Spec Kit: https://github.com/github/spec-kit  
- Guia brownfield: https://github.com/github/spec-kit/blob/main/docs/guides/existing-projects.md  
- AGENTS.md: https://agents.md/  

**Versão do playbook:** 1.0.0 · Uso: copiar este arquivo para qualquer repo e rodar o prompt acima.
