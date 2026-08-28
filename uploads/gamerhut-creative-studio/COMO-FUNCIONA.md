# PORTAL GAMER HUT — Como tudo funciona

Documento de referência do projeto: o que é cada arquivo, como as partes conversam
entre si e o que precisa acontecer para o site funcionar publicado.

---

## 1. Visão geral

O Portal é um **site estático** (só HTML, CSS e JS — sem instalação, sem build) com
4 páginas, mais **um servidor pequeno** que existe só para guardar a chave da IA em
segredo.

```
PORTAL (GitHub Pages)                    SERVIDOR (Cloudflare Worker)
┌──────────────────────────┐             ┌────────────────────────────┐
│ index.html   → portal    │             │ worker.js                  │
│ studio.html  → estúdio   │  briefing   │  guarda ANTHROPIC_API_KEY  │
│ copys.html   → copys ────┼────────────►│  fala com a API da IA      │
│ review.html  → review    │◄────────────┤  devolve o texto           │
└──────────────────────────┘   copys     └────────────────────────────┘
```

Regra de ouro: **a chave da API nunca fica em arquivo do site**. Ela vive apenas como
*secret* no Cloudflare. Quem tem acesso ao repositório no GitHub não vê a chave.

---

## 2. Os arquivos

### Páginas
| Arquivo | O que é |
|---|---|
| `index.html` | Landing do portal. Hero com o controle da marca ao fundo e os cards dos módulos. |
| `studio.html` | **Creative Studio** — onde as artes são geradas e exportadas. |
| `copys.html` | **Criação de Copys** — gera legendas com IA na voz da marca. |
| `review.html` | **Review de Criativos** — placeholder visual (ainda não funcional). |

### Suporte
| Arquivo | O que é |
|---|---|
| `portal.css` | Estilo compartilhado das páginas do portal (cores, fontes, nav, footer, botões). |
| `brand-voice.js` | **O guia de marca.** Todo o branding book em texto. É injetado no prompt em cada geração. |
| `config.js` | Guarda a URL do servidor de IA (`proxyUrl`). Único arquivo que você mexe ao trocar de servidor. |
| `assets/` | Logos e marcas (branca, laranja, preta, símbolo do controle). |

### O estúdio (código do gerador de artes)
| Arquivo | O que faz |
|---|---|
| `app/data.jsx` | **Tokens e dados.** Cores da marca, as 8 categorias/tags, e os estilos de fundo (padrões). |
| `app/preview.jsx` | **Os modelos.** Desenha cada template na tela e no canvas de exportação (PNG e vídeo). |
| `app/controls.jsx` | **Peças de controle.** Campos de texto, upload de imagem, barra de desfoque, seletor de cor. |
| `app/panel.jsx` | **Painel da esquerda.** Monta os campos certos para cada modelo escolhido. |
| `app/app.jsx` | **Casca do app.** Estado, salvamento automático, exportação de PNG e de vídeo. |

### Servidor
| Arquivo | O que é |
|---|---|
| `server/worker.js` | O código do servidor de IA. Cole no Cloudflare Worker. |
| `server/DEPLOY.md` | Passo a passo do deploy (conta, secret, URL, travar origem). |

---

## 3. Como o Creative Studio funciona

**Modelos disponíveis:** Post c/ Imagem · Post Blocado · Carrossel (3–8 páginas, com
página de vídeo) · Quiz (pergunta ou "esse ou aquele") · Top/Ranking · Novidades da
Semana · Thumbnail de YouTube · Capa de Reels.

**Como o texto vira arte:** você escolhe o modelo, preenche os campos no painel da
esquerda e a arte é desenhada ao vivo na direita, no tamanho real (1080×1350 no feed,
1080×1920 nos stories, 1920×1080 na thumb).

**Categorias (tags):** cada uma tem uma cor própria (Notícias, Pré-venda, Restoque,
Lançamento, Preview, Trailer, Review, Quiz). A cor da tag pinta os detalhes da arte
automaticamente. Definidas em `app/data.jsx` — dá para adicionar/remover ali.

**Imagens:** arraste para o slot. Abaixo de cada imagem existe o controle de
**desfoque** (botão rápido em 35% + barra de 0 a 100%) para o texto ficar legível
sobre a foto. No Quiz e no Ranking a imagem entra como fundo, com um fade escuro
automático em cima.

**Estilos de fundo:** sólido, xadrez 8-bit, grade, scanlines, e o **controle** (o
símbolo da marca, grande, inclinado a −30°), com barra de opacidade.

**Exportação:**
- **PNG** — baixa a arte no tamanho real. No carrossel, exporta todas as páginas.
- **Vídeo** — na página de vídeo do carrossel, grava o trailer dentro do quadro da
  marca. A gravação é em **tempo real** (o trailer precisa tocar), com barra de
  progresso e segundos restantes. Roda em segundo plano: pode trocar de aba, só não
  feche a janela. Prioriza MP4/H.264; se o navegador só permitir WebM, existe o
  botão **"Som do trailer"** — desligado, o arquivo toca em qualquer player e é
  aceito pelo Instagram.

**Salvamento:** tudo que você digita fica salvo no navegador automaticamente. Fechar
e voltar mantém o trabalho. O botão "Resetar tudo" limpa.

---

## 4. Como a Criação de Copys funciona

**O fluxo:** briefing → tom de voz → categoria → (modelo da arte) → **Gerar copys** →
3 variações → **Criar arte**.

**O guia de marca é obrigatório.** Em cada geração, o conteúdo de `brand-voice.js` é
enviado junto com o pedido. É por isso que as copys saem começando pelo nome do jogo,
usando "Se liga", valorizando a mídia física e fechando com uma pergunta. O selo verde
"GUIA DE MARCA CARREGADO" na página confirma que está ativo.

> **Para mudar o tom de voz da marca, edite só o `brand-voice.js`.** Não precisa
> mexer em mais nada — toda copy passa a seguir a mudança.

**O que cada variação traz:** título curto (para a arte), legenda de feed, CTA e
hashtags. Botão **COPIAR** leva o texto completo.

**Botão CRIAR ARTE:** manda a copy para o estúdio já preenchido, no modelo escolhido,
com a categoria certa e a imagem em branco para você colocar depois. Preserva o que
você já tinha no estúdio.

**Modo Carrossel:** ao escolher Carrossel, aparece o seletor de **páginas (3 a 8)**. A
IA então estrutura o conteúdo pensando na **capa** + nas **páginas internas** (uma
ideia por página, a última com CTA), e o card mostra a estrutura antes de você criar a
arte. Nesse modo saem 2 variações em vez de 3, para a resposta não vir cortada.

**Onde a IA roda:**
- Dentro do ambiente Claude → usa o conector nativo, sem chave.
- No site publicado → usa o servidor do `config.js`.
Se o `proxyUrl` estiver vazio no site publicado, a página avisa que o servidor não
está configurado.

---

## 5. O servidor de IA (resumo)

`server/worker.js` recebe `{ "prompt": "..." }` por POST, chama a API da Anthropic
com a chave guardada como secret, e devolve `{ "text": "..." }`.

Configuração atual:
- **Modelo:** `claude-sonnet-4-6` (troque para `claude-haiku-4-5` se quiser mais barato).
- **Limite de resposta:** 2048 tokens.
- **Origens permitidas:** `['*']`. Depois de publicar, troque pela URL do seu site
  para travar o acesso e dê Deploy de novo.

O passo a passo completo está em `server/DEPLOY.md`.

---

## 6. Publicar / atualizar

1. Suba todos os arquivos e pastas para o repositório.
2. **Settings → Pages → Source: `main` / root → Save.**
3. Ao mexer no `worker.js`, além do commit é preciso dar **Deploy** no Cloudflare.
4. Ao testar depois de atualizar, use **Ctrl+Shift+R** para não pegar cache.

---

## 7. Onde mexer para cada tipo de mudança

| Quero mudar… | Arquivo |
|---|---|
| Tom de voz / regras de copy | `brand-voice.js` |
| Cores da marca, categorias, estilos de fundo | `app/data.jsx` |
| Layout de um modelo de arte | `app/preview.jsx` |
| Campos do painel de um modelo | `app/panel.jsx` |
| Texto/cards da página inicial | `index.html` |
| Estilo geral do portal | `portal.css` |
| URL do servidor de IA | `config.js` |
| Modelo da IA, limite, origens | `server/worker.js` |

---

## 8. O que ainda está em aberto

- **Review de Criativos** — hoje é só a interface; a análise não está ligada.
- **Downloader de vídeo** — pendente. Precisa de servidor próprio (o navegador sozinho
  não baixa vídeo do YouTube).
- **Trocar a chave da API** — quando quiser, basta atualizar o secret no Cloudflare.
  Nenhum arquivo do site muda.
