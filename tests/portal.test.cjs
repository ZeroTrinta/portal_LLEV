/* node --test tests/portal.test.cjs — sem instalação de dependências */
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('Portal LLEV.dc.html','utf8');
const logic=source.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic{setState(p,done){Object.assign(this.state,typeof p==='function'?p(this.state):p);if(done)done()}forceUpdate(){}}
function setup(){
 const context={DCLogic,React:{createRef:()=>({current:null}),createElement:(type,props,...children)=>({type,props:props||{},children})},window:{innerWidth:1280,innerHeight:900},localStorage:{setItem(){}},setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:cb=>cb(),URL,console};
 vm.createContext(context); vm.runInContext(fs.readFileSync('creative-art.js','utf8'),context);vm.runInContext(logic+'\nthis.Portal=Component;this.templates=TEMPLATES;this.products=PRODUCTS;',context);return {c:new context.Portal(),context};
}
test('13 modelos renderizam nos dois formatos e em largura móvel',()=>{
 const {c,context}=setup();
 for(const width of [390,1280])for(const fmt of ['carrossel','story'])for(const t of context.templates){context.window.innerWidth=width;c.state.tpl=t.id;c.state.fmt=fmt;const v=c.renderVals();assert.ok(v.scale>0);assert.ok(v.boxW<=width);assert.ok(v.fields.length);if(['post','campanha','tecnica','colecao'].includes(t.id))assert.equal(v.visualArt.props['data-visual-art'],t.id);}
});
test('estado inválido e índices antigos são recuperados',()=>{const {c}=setup();const st=c.migrate({tpl:'bad',fmt:'bad',vals:null,page:-99,copys:{},exporting:true});assert.equal(st.page,0);assert.equal(st.exporting,false);assert.ok(!st.tpl);assert.ok(Array.isArray(st.copys));assert.equal(c.migrate({vals:{'post.titulo':'antigo',titulo:'atual'}}).vals.titulo,'atual');});
test('produto novo limpa especificações e benefícios do anterior',()=>{const {c}=setup();c.state.vals={s3:'velho',v4:'velho'};c.loadProduct({nome:'Teste',grupo:'Telhas',especs:[['MEDIDA','1 m']],pix:'R$ 10',preco:'R$ 12',url:'https://example.com'});assert.equal(c.state.vals.s3,'');assert.equal(c.state.vals.v4,'');assert.equal(c.state.vals.medida,'1 m');});
test('campos, detalhes e variantes chegam aos layouts sem HTML injetado',()=>{const {c}=setup();c.state.tpl='tecnica';c.state.vals={titulo:'<script>alert(1)</script>',medida:'6 m',s1:'Luz natural'};c.state.imgDetail1='data:image/png;base64,abc';let v=c.renderVals();assert.equal(v.extraImages.length,2);assert.ok(JSON.stringify(v.visualArt).includes('6 m'));assert.ok(JSON.stringify(v.visualArt).includes('data:image/png'));c.state.tpl='colecao';assert.equal(c.renderVals().extraImages.length,3);});
test('exportação em lote restaura página e desbloqueia em caso de falha',async()=>{const {c}=setup();c.state.page=2;let n=0;c.capturePng=async()=>{if(++n===2)throw new Error('imagem quebrada')};await c.exportAll({w:1080,h:1350},{id:'dica'},4);assert.equal(c.state.page,2);assert.equal(c.state.exporting,false);assert.equal(c.state.exportErr,'imagem quebrada');});
test('exportação individual bloqueia duplicata e informa erro',async()=>{const {c}=setup();c.capturePng=async()=>{throw new Error('Falha de rede')};await c.exportPng({},{});assert.equal(c.state.exporting,false);assert.equal(c.state.exportErr,'Falha de rede');});
test('bundle contém os mesmos layouts e campos do fonte',()=>{const index=fs.readFileSync('index.html','utf8');const html=JSON.parse(index.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/)[1]);assert.ok(html.includes(fs.readFileSync('creative-art.js','utf8').split("'assets/logo-branco-laranja.png'")[0]));assert.ok(html.includes("id:'colecao'"));assert.ok(html.includes('capturePng'));});
test('copys usam briefing, tom e público e recusam briefing vazio',()=>{const {c}=setup();c.generateCopys();assert.ok(c.state.copyErr);c.state.briefing='Apresentar a coleção fitness';c.generateCopys();assert.equal(c.state.copys.length,3);assert.ok(c.state.copys.every(x=>x.legenda.includes('coleção fitness')));const previous=c.state.copys[0].legenda;c.state.tone='Comercial';c.state.aud='Consumidor final';c.generateCopys();assert.notEqual(c.state.copys[0].legenda,previous);});
test('todos os modelos antigos usam o novo renderizador e os campos próprios',()=>{
 const {c}=setup();const samples={passo:{p1:'ETAPA_TESTE'},ficha:{v1:'MEDIDA_TESTE'},onde:{o1:'LOCAL_TESTE'},erro:{errado:'ERRO_TESTE',certo:'CERTO_TESTE'},promo:{de:'R$ 300',por:'R$ 200'},catalogo:{n1:'PRODUTO_TESTE',pr1:'R$ 20'},selo:{s1:'BENEFICIO_TESTE'},faq:{resposta:'RESPOSTA_TESTE'}};
 for(const [tpl,vals] of Object.entries(samples)){c.state.tpl=tpl;c.state.vals=vals;const v=c.renderVals();assert.equal(v.legacyArt,false);assert.equal(v.visualArt.props['data-visual-art'],tpl);for(const value of Object.values(vals))assert.ok(JSON.stringify(v.visualArt).includes(value),tpl+': '+value);}
 c.state.tpl='dica';c.state.vals={titulo:'CAPA_TESTE',d1:'PAGINA_1',d2:'PAGINA_2',d3:'PAGINA_3'};
 for(let page=0;page<4;page++){c.state.page=page;assert.ok(JSON.stringify(c.renderVals().visualArt).includes(page?'PAGINA_'+page:'CAPA_TESTE'));}
});
