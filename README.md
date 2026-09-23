# Engenharia com IA (Spec Kit + AGENTS.md + testes)

Este repositório adota práticas de desenvolvimento assistido por IA **descobertas automaticamente** pelas IDEs/agentes — o desenvolvedor não precisa “lembrar de ativar” o fluxo.

| Peça | Onde | Quem lê |
|------|------|---------|
| **Instruções canônicas** | [`AGENTS.md`](../AGENTS.md) | Cursor, Codex, vários agentes ([agents.md](https://agents.md/)) |
| **Claude Code** | [`CLAUDE.md`](../CLAUDE.md) → aponta para `AGENTS.md` | Claude Code |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) | Copilot Chat / agent |
| **Cursor Rules** | [`.cursor/rules/*.mdc`](../.cursor/rules/) | Cursor Agent (sempre / por glob) |
| **Spec Kit skills** | [`.cursor/skills/speckit-*`](../.cursor/skills/) | Cursor (`/speckit-specify`, etc.) |
| **Constitution** | [`.specify/memory/constitution.md`](../.specify/memory/constitution.md) | Spec Kit + humanos |
| **Testes** | Vitest — `npm test` | CI/local / DoD do agente |
| **Deploy** | [`docs/deploy.md`](deploy.md) | Humanos + regras Cursor |

## Como a IDE “pega” sozinha

### Cursor

1. Abra o projeto pela **raiz** do repo (`upstar_bot/`).
2. O Agent carrega:
   - `AGENTS.md`
   - Rules com `alwaysApply: true` (ex.: `upstar-core.mdc`)
   - Rules por arquivo aberto (globs FRAT/deploy)
   - Skills Spec Kit (comandos `/speckit-*`)
3. Nada a configurar no Preferences além de usar o Agent neste workspace.

Rules versionadas (não ignore no git):

- `upstar-core.mdc` — sempre
- `frat-domain.mdc` — ao editar FRAT/score/mitigações
- `deploy.mdc` — ao editar deploy/Docker/Cloud Build

### Claude Code / Codex / outros

- Claude: lê `CLAUDE.md` (ponte para `AGENTS.md`).
- Qualquer agente que suporte [AGENTS.md](https://agents.md/): basta o arquivo na raiz.
- Copilot: `.github/copilot-instructions.md`.

### Para o desenvolvedor no dia a dia

Pedir features normalmente no chat. O agente deve:

1. Seguir `AGENTS.md` / rules
2. Para mudança de produto: Spec Kit (`/speckit-specify` …)
3. Rodar `npm test` em regras de domínio
4. Não sugerir deploy via Docker de produção

Se o agente “esquecer”, lembre: *“siga AGENTS.md e a constitution Spec Kit”*.

## Levar para outro projeto

Playbook autocontido (copie só este arquivo e peça à IA para executar):  
[`docs/playbook-bootstrap-ia.md`](playbook-bootstrap-ia.md)

## Fluxo Spec Kit no Cursor

1. `/speckit-constitution` — princípios (já preenchidos)
2. `/speckit-specify` — especificar a mudança
3. `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`
4. Opcionais: `/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`

Guia oficial brownfield: [Adopting Spec Kit](https://github.com/github/spec-kit/blob/main/docs/guides/existing-projects.md).

## Testes

```bash
npm test
npm run test:watch
```

Cobertura inicial: `tests/unit/frat-mitigations.test.ts`, `tests/unit/frat-score.engine.test.ts`.

## Definition of Done

Ver checklist em `AGENTS.md`. Em resumo: spec/tasks quando for produto, testes verdes, docs atualizadas se o comportamento externo mudou.
