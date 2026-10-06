/* LLEV: layouts fotográficos. Textos e imagens pertencem ao estado do editor. */
(function () {
  'use strict';
  const NAVY = '#011F38', ORANGE = '#FE5D0A';
  function contrast(hex) {
    const rgb = (hex || ORANGE).replace('#', '').match(/.{2}/g).map(v => parseInt(v, 16) / 255);
    const luminance = rgb.map(v => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4));
    return luminance[0] * .2126 + luminance[1] * .7152 + luminance[2] * .0722 > .42 ? NAVY : '#FFFFFF';
  }
  function render(s, f, fmt) {
    const h = React.createElement, accent = /^#[0-9a-f]{6}$/i.test(s.accent) ? s.accent : ORANGE;
    const collection = s.tpl === 'colecao', campaign = s.tpl === 'campanha', technical = s.tpl === 'tecnica';
    const dark = collection || campaign, ink = dark ? '#FFFFFF' : NAVY;
    const abs = { position:'absolute' }, text = { margin:0, overflowWrap:'anywhere', whiteSpace:'pre-line' };
    const H = fmt.h, bodyWidth = technical ? 620 : 690;
    function label(value, style, tag) { return value ? h(tag || 'div', { style:{...text,...style} }, value) : null; }
    function picture(src, style) { return src ? h('img', { src, alt:'', style:{ ...abs, objectFit:'contain', ...style } }) : null; }
    function icon(i) {
      const paths = [
        'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6L7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
        'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6zM8 12l3 3 5-6',
        'M3 11 12 3l9 8M6 9v12h12V9M10 21v-7h4v7'
      ];
      return h('span',{style:{flex:'0 0 76px',width:76,height:76,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:dark?NAVY:'#E5F4FC',border:'2px solid '+(dark?'#ffffff22':'#C7E8F6')}},
        h('svg',{width:44,height:44,viewBox:'0 0 24 24',fill:'none',stroke:i===0?accent:(dark?'#FFFFFF':NAVY),strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'},h('path',{d:paths[i]})));
    }
    const benefits = ['s1','s2','s3'].map((key,i)=> f[key] ? h('div',{key,style:{display:'flex',alignItems:'center',gap:18}},icon(i),label(f[key],{fontSize:27,fontWeight:700,lineHeight:1.2})) : null);
    const titleLength = (f.titulo||'').length + (f.destaque||'').length;
    const titleSize = collection ? (titleLength>65?62:80) : titleLength>100?48:titleLength>65?58:72;
    const heading = h('div',{'data-layout-heading':true,style:{...abs,top:collection?56:64,left:62,right:62,color:ink}},
      label(f.chamada,{fontSize:22,fontWeight:700,letterSpacing:2,marginBottom:18}),
      h('h2',{style:{...text,maxWidth:collection?'100%':bodyWidth,fontSize:titleSize,fontWeight:900,lineHeight:1.04,letterSpacing:-2}},
        f.titulo, f.destaque ? h('span',{style:{display:'block',color:accent}},f.destaque) : null),
      collection ? null : h('div',{style:{width:170,height:6,background:accent,margin:'22px 0'}}),
      label(f.apoio,{maxWidth:collection?950:580,fontSize:30,lineHeight:1.32,marginTop:collection?18:0}));
    const layers = [
      h('div',{key:'base',style:{...abs,inset:0,background:dark?'linear-gradient(135deg,#012E53,#01101E)':'linear-gradient(110deg,#FFFFFF 25%,#D9EDFA)'}}),
      picture(s.imgBg,{inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:(s.posX??50)+'% '+(s.posY??50)+'%',filter:'blur('+(s.blur||0)+'px)',transform:'scale(1.03)'}),
      h('div',{key:'scrim',style:{...abs,inset:0,background:dark ? 'linear-gradient(180deg,rgba(0,0,0,.82),rgba(0,0,0,.08) 40%,rgba(0,0,0,.65) 88%)' : 'linear-gradient(90deg,#FFFFFF 8%,rgba(255,255,255,.96) 30%,rgba(255,255,255,.58) 57%,rgba(255,255,255,0) 88%)'}}),
      s.dim>0 ? h('div',{key:'dim',style:{...abs,inset:0,background:'#011F38',opacity:s.dim/100*.6}}) : null,
      heading
    ];
    if(collection) {
      const top = H*.27, bottom = 220;
      layers.push(h('div',{key:'variants','data-layout-content':true,style:{...abs,left:34,right:34,top,bottom,display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:14}},
        ...[1,2,3].map(i=>h('div',{key:i,style:{position:'relative',minWidth:0,display:'flex',flexDirection:'column',justifyContent:'flex-end'}},
          picture(s['imgVariant'+i],{inset:0,width:'100%',height:'calc(100% - 120px)',objectFit:'contain'}),
          h('div',{style:{position:'relative',textAlign:'center',color:'#FFFFFF',padding:'18px 12px',background:'linear-gradient(0deg,rgba(0,0,0,.7),transparent)'}},
            label(f['cor'+i],{fontSize:30,fontWeight:800,lineHeight:1.1}),
            h('div',{style:{height:7,width:108,margin:'14px auto 0',background:/^#[0-9a-f]{6}$/i.test(f['tom'+i])?f['tom'+i]:accent}}))))));
    } else {
      layers.push(h('div',{key:'benefits','data-layout-content':true,style:{...abs,left:62,top:H*.345,width:technical?430:480,display:'flex',flexDirection:'column',gap:22,color:ink}},...benefits));
      if(technical) {
        layers.push(h('div',{key:'specs',style:{...abs,left:62,top:H*.625,width:520,color:NAVY}},
          label(f.produto,{fontSize:32,fontWeight:800,lineHeight:1.2}),
          f.medida ? label(f.medida,{display:'inline-block',background:accent,color:contrast(accent),borderRadius:16,padding:'14px 22px',fontSize:40,fontWeight:800,margin:'18px 0'}) : null,
          label(f.detalhe,{fontSize:23,fontWeight:600,lineHeight:1.35}),
          h('div',{style:{display:'flex',gap:14,marginTop:20}},...[1,2].map(i=>s['imgDetail'+i]?h('img',{key:i,src:s['imgDetail'+i],alt:'',style:{width:218,height:146,objectFit:'contain',background:'#FFFFFF',border:'2px solid #011F3822',borderRadius:12}}):null))));
        layers.push(picture(s.imgProd,{right:8,bottom:H*.19,width:Math.min(68,s.prodSize||62)+'%',height:'40%',filter:'drop-shadow(0 20px 30px #011F3844)'}));
      } else {
        layers.push(picture(s.imgProd,{right:30,bottom:190,width:(s.prodSize||62)+'%',height:'45%',filter:'drop-shadow(0 20px 30px #011F3855)'}));
        if(campaign && f.medida) layers.push(label(f.medida,{...abs,left:62,top:H*.60,maxWidth:600,padding:'20px 32px',fontSize:58,fontWeight:900,lineHeight:1.1,background:accent,color:contrast(accent),borderRadius:24,boxShadow:'0 0 0 3px #ffffff66'}));
      }
    }
    layers.push(h('div',{key:'footer',style:{...abs,left:0,right:0,bottom:0,height:collection?175:160,background:collection?'#FFFFFF':dark?NAVY:'rgba(255,255,255,.96)',borderTop:collection?'8px solid '+accent:'none',display:'flex',alignItems:'center',justifyContent:collection?'center':'space-between',gap:26,padding:'28px 62px'}},
      !collection && f.cta ? label(f.cta,{maxWidth:640,fontSize:26,fontWeight:800,lineHeight:1.2,background:accent,color:contrast(accent),padding:'18px 26px',borderRadius:20}) : null,
      h('img',{src:dark&&!collection?'assets/logo-branco-laranja.png':'assets/logo-principal.png',alt:'LLEV',style:{width:collection?240:190,maxHeight:105,objectFit:'contain',marginLeft:collection?0:'auto'}})));
    return h('div',{'data-visual-art':s.tpl,style:{...abs,inset:0,fontFamily:'Montserrat,sans-serif',overflow:'hidden'}},...layers);
  }
  window.LLEVArt = {render,contrast};
})();
