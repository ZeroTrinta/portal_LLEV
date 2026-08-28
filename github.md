repo: ZeroTrinta/portal_LLEV
branch: main

## Last sync
date: 2026-08-28T00:00:00Z

### Updated in this project
- Módulo de Revisão de arte: sobe o PNG/JPG e recebe nota, veredito e três blocos — design, texto e conferência de produto contra o catálogo.
- Revisão exige transcrição literal do texto antes de julgar (pega letra cortada tipo "anta Térmica"); um erro de grafia derruba o veredito e trava a nota em 5.
- Indicador de progresso na revisão: cronômetro, barra e as cinco etapas do parecer.
- Chave da API guardada só no navegador de quem usa (entrada `llev-api-key`), fora do código e fora do estado salvo do portal; modal abre sozinho quando não há chave e funciona como senha.
- Biblioteca com 60+ itens do catálogo real, busca, filtro por grupo, painel de detalhes com descrição própria por SKU e perguntas frequentes por linha de produto.
- Botão Copiar URL no estúdio para colar no sticker de link do story.
- Pauta de tendências por estação: sugestões que o usuário aplica linha por linha, sem sobrescrever a arte aberta.

## Screen map
| Tela | Origem |
|---|---|
| Portal LLEV.dc.html · Portal | uploads/gamerhut-creative-studio/index.html, portal.css |
| Portal LLEV.dc.html · Estúdio | uploads/gamerhut-creative-studio/app/data.jsx, app/panel.jsx, app/preview.jsx |
| Portal LLEV.dc.html · Copys | uploads/gamerhut-creative-studio/copys.html, brand-voice.js |
| Portal LLEV.dc.html · Biblioteca | catálogo llevlar.com.br (PRODUCTS, INFO, DESC) |
| Portal LLEV.dc.html · Revisão | novo (API da Anthropic direto do navegador) |
| index.html | compilado de Portal LLEV.dc.html |
