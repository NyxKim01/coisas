@echo off
setlocal
chcp 65001 >nul
title Atualizar base do painel
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado neste computador.
  echo O Node.js e necessario apenas para atualizar a base, nao para os gerentes abrirem o HTML.
  pause
  exit /b 1
)
node "%~dp0atualizar-base.cjs" "%~1"
set "PAINEL_RESULTADO=%errorlevel%"
echo.
pause
exit /b %PAINEL_RESULTADO%
