# Portal LLEV

Portal de criação de conteúdo com estúdio, copys, catálogo e revisão de arte.
O `index.html` é o arquivo publicado pelo GitHub Pages: mantém os logos,
Montserrat, React, runtime e exportador incorporados, sem instalação para usar.

## Opções de arte

Quatro opções seguem a linguagem das referências da marca (fotografia, azul,
laranja, títulos grandes e logo no rodapé):

- **Produto em aplicação**: fundo fotográfico com faixa clara para leitura,
  título em duas cores, três benefícios opcionais, recorte do produto e CTA.
- **Campanha / medida**: foto em toda a arte, título claro, destaque laranja,
  benefícios e medida/diferencial em uma faixa de destaque.
- **Ficha visual**: foto de aplicação, benefícios, produto, medidas,
  especificações e duas fotos de detalhe opcionais.
- **Coleção / cores**: fundo escuro, título no topo, três nomes e cores
  editáveis, três recortes opcionais e logo no rodapé branco. Pode usar uma
  única foto com os três produtos como fundo, sem enviar recortes separados.

Os nove modelos de conteúdo também usam o padrão fotográfico: **Passo a passo**
com etapas numeradas; **Ficha técnica** com tabela; **Onde aplicar** com quatro
locais; **Erro × certo** com comparação; **Preço / promo** com preço anterior
riscado; **Dica (carrossel)** com quatro páginas; **Catálogo** com quatro produtos;
**Diferenciais** (antigo Selo / garantia) e **Pergunta frequente**. Todos aceitam
foto de fundo e recorte do produto. Preços de exemplo foram removidos.
Todos oferecem Feed **1080×1350** e Story **1080×1920**.

### Como montar as artes

1. Abra **Estúdio** e escolha o modelo.
2. Envie uma foto de aplicação em **Imagem de fundo** e ajuste posição,
   desfoque e escurecimento. Para os modelos claros, comece em 0% de escurecimento.
3. Se desejar, envie o produto com fundo transparente em **Produto em destaque**.
4. Preencha título, destaque, benefícios e os campos específicos. Benefícios,
   medidas e especificações ficam vazios até receberem informações reais.
5. Exporte em **Baixar PNG**. No carrossel, **Baixar todas** exporta quatro páginas
   e retorna à página que estava aberta; o navegador pode pedir autorização
   para múltiplos downloads.

Textos são compartilhados entre modelos para reutilizar uma campanha.
Os textos e ajustes são salvos localmente no navegador; **imagens ficam apenas
na sessão**. Envie-as novamente após recarregar. Uploads: PNG, JPG ou WEBP,
até 15 MB no estúdio e 5 MB na revisão.

## Revisão geral — outubro de 2026

- Editor, copys e revisão adaptados a telas estreitas.
- Exportação com bloqueio de chamadas simultâneas, espera por imagens e fontes,
  erros visíveis e restauração da página em caso de falha no lote.
- Prévia não perde a escala durante a exportação; títulos que invadem a área
  seguinte nos novos modelos impedem a exportação com uma orientação de ajuste.
- Recuperação de estados inválidos, modelos antigos e índices fora dos limites.
- Troca de produto limpa especificações e benefícios anteriores.
- Copys usam briefing, tom e público para criar três rascunhos estruturados
  **sem IA**. A interface informa essa limitação.
- Revisão por IA pede chave somente quando necessária, limita o tempo da
  requisição e impede um parecer de aprovação quando existem erros reportados.
- Catálogo é uma referência estática: confirme preços e disponibilidade no
  site do produto antes de publicar. Não há sincronização automática.

A revisão por IA usa a integração Anthropic já existente e precisa de uma chave
válida configurada pelo usuário. Nenhuma chamada paga é feita pelos testes.

## Desenvolvimento e publicação

- `Portal LLEV.dc.html`: fonte do portal e lógica de estado.
- `creative-art.js`: renderizadores dos 13 layouts fotográficos.
- `support.js`: runtime gerado do projeto; não editar manualmente.
- `assets/`: logos oficiais.
- `scripts/build.py`: atualiza o bundle publicado a partir do fonte, reutilizando
  as dependências/fontes já incorporadas ao `index.html` (sem rede).
- `tests/portal.test.cjs`: regressões de lógica e estrutura dos renderizadores.

```sh
python3 scripts/build.py
node --test tests/portal.test.cjs
python3 -m http.server 8080
```

Abra `http://localhost:8080/`. Commitar fonte, renderizadores e `index.html`
juntos. GitHub Pages publica a branch `main`, pasta raiz.

Os testes verificam renderização estrutural, formatos, recuperação de estado,
preços/campos, exportação em falha e atualização do bundle. Não substituem
inspeção visual no navegador, download real de PNG ou revisão com uma chave de IA.
