# Portal LLEV Lar

Portal de criação de conteúdo da LLEV Lar — mantas térmicas e fitas asfálticas.

## O que tem aqui

- **`index.html`** — o portal completo, arquivo único e autossuficiente. Abre no navegador sem servidor, sem build, sem instalação. É o que o GitHub Pages precisa servir.
- **`Portal LLEV.dc.html`** — o fonte editável. É aqui que se muda qualquer coisa.
- **`assets/`** — os logos oficiais da marca (principal, branco, preto, branco e laranja).

## Módulos

| Módulo | O que faz |
|---|---|
| Portal | Landing com os cards dos módulos |
| Creative Studio | 7 modelos de arte em story 1080×1920 e feed 1080×1350, com exportação PNG no tamanho real |
| Criação de copys | Briefing curto → 3 variações no tom técnico da marca, com botão "Criar arte" que joga o texto no estúdio |
| Biblioteca de produtos | Fichas técnicas que alimentam o modelo de ficha do estúdio |

## Modelos de arte

1. **Post c/ imagem** — foto de fundo com desfoque e escurecimento + PNG do produto em destaque
2. **Passo a passo** — sequência numerada de aplicação
3. **Ficha técnica** — produto e especificações
4. **Onde aplicar** — grade de locais (laje, telhado, calha, caixa d'água)
5. **Erro × certo** — comparativo em dois blocos
6. **Preço / promo** — de/por com condição
7. **Dica (carrossel)** — capa + 3 páginas navegáveis

## Onde mexer para cada tipo de mudança

| Quero mudar | Onde |
|---|---|
| Tom e conteúdo das copys | `Portal LLEV.dc.html` → const `COPY_BASE` |
| Categorias e suas cores | `Portal LLEV.dc.html` → const `TAGS` |
| Lista de modelos de arte | `Portal LLEV.dc.html` → const `TEMPLATES` |
| Campos de um modelo | `Portal LLEV.dc.html` → const `FIELDS` |
| Formatos e dimensões | `Portal LLEV.dc.html` → const `FORMATS` |
| Estilos de fundo e texturas | `Portal LLEV.dc.html` → const `BGS` e `PATTERNS` |
| Layout de um modelo | o bloco `<sc-if>` correspondente no template |

Depois de editar o fonte, é preciso gerar de novo o `index.html` para publicar.

## Identidade visual

Do guideline oficial da LLEV Lar:

- Tipografia: **Montserrat** (Thin → Black)
- Laranja principal: `#FE5D0A`
- Laranja secundário: `#FE8401`
- Azul escuro: `#011F38`
- Azul médio: `#012E53`
- Off-white: `#EDEDED`

## Publicar

Ativar GitHub Pages em Settings → Pages, branch `main`, pasta raiz. O `index.html` passa a servir o portal direto.

## Pendências

- As fichas da biblioteca estão com os campos em branco de propósito — precisam dos dados reais dos produtos (medidas, composição, aplicação, rendimento).
- A criação de copys usa variações fixas de exemplo. Para gerar texto sob demanda com IA é preciso um servidor mínimo guardando a chave como secret — a chave nunca pode ficar em arquivo do site.
