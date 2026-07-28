# Template GPS.dev — Sistema Root

Template base para todos os sistemas GPS.dev.

## Estrutura

```
template-gps/
├── index.html       ← tela de login
├── dashboard.html   ← painel principal
├── css/
│   └── style.css    ← design system completo
├── js/
│   └── app.js       ← auth, sidebar, toast, utils
└── README.md
```

## Como usar

1. Copie esta pasta para `_ativos/nome-do-sistema`
2. Renomeie `NOME DO SISTEMA` no index.html e dashboard.html
3. Altere a senha em `js/app.js` → `GPS.config.senha`
4. Adicione os módulos na sidebar do dashboard.html
5. Crie as páginas de cada módulo seguindo o padrão

## Design tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0f172a` | Fundo principal |
| `--bg-card` | `#1e293b` | Cards e sidebar |
| `--orange` | `#F97316` | Destaque, CTAs |
| `--border` | `#334155` | Bordas |
| `--text` | `#f1f5f9` | Texto principal |
| `--text-muted` | `#94a3b8` | Texto secundário |

## Componentes disponíveis

- `.cards-grid` + `.card` — cards de resumo com ícone, valor, label e delta
- `.table-wrap` — tabela com header, busca e badge de status
- `.badge` — badge colorido (success, warning, danger, orange)
- `.btn` — botões (btn-primary, btn-ghost)
- `.alert` — alertas (success, danger, warning)
- `GPS.toast.show(msg, tipo)` — notificação flutuante
- `GPS.fmt.moeda(valor)` — formata em R$
- `GPS.fmt.data(dateStr)` — formata data pt-BR
- `GPS.storage.get/set/del(key)` — localStorage helpers

## Senhas padrão

- Desenvolvimento: `gps2025`
- **Alterar antes de entregar ao cliente**

---
GPS.dev © 2025 — filósofo que programa
