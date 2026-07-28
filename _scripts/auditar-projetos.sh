#!/bin/bash
echo "=== Verificando quais pastas tem Git conectado ao GitHub ==="
echo ""
for dir in ~/dev/projetos/*/ ~/agrodigital ~/sistema-hotel ~/Sistema-root ~/Sistema-gestao-Universal ~/ser-digital ~/landing-servicos-web ~/dgustapaulalang ~/PROJETOS/*/ ~/projetos/*/; do
  [ -d "$dir" ] || continue
  nome=$(basename "$dir")
  if [ -d "$dir/.git" ]; then
    remote=$(git -C "$dir" remote get-url origin 2>/dev/null || echo "SEM REMOTE")
    echo "[OK] $nome -> $remote"
  else
    echo "[X] $nome -> SEM GIT nao publicado"
  fi
done
