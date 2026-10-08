/* Recanto dos Lagos: topo que escurece, sol que se põe (só sem prefers-reduced-motion),
   pré-orçamento em 4 passos e pedido de visita → WhatsApp.
   Número: (47) 99131-8633, o do Google. WhatsApp oficial: a confirmar. */
(function(){
  var WA='5547991318633';
  var calmo=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var topo=document.getElementById('topo'), sol=document.getElementById('sol');
  var horizonte=document.querySelector('.horizonte'), noite=document.getElementById('festa');
  var pedido=false;
  function quadro(){
    pedido=false;
    var h=topo.offsetHeight;
    topo.classList.toggle('escuro', noite.getBoundingClientRect().top<=h);
    if(!calmo&&sol&&horizonte){
      var r=horizonte.getBoundingClientRect(), vh=window.innerHeight;
      var p=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
      sol.style.transform='translateY('+Math.round(p*(r.height-10))+'px)';
    }
  }
  window.addEventListener('scroll',function(){if(!pedido){pedido=true;requestAnimationFrame(quadro);}},{passive:true});
  window.addEventListener('resize',quadro);quadro();

  function hojeISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function br(iso){var p=iso.split('-');return p[2]+'/'+p[1]+'/'+p[0];}
  function abreWhats(texto){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(texto),'_blank','noopener');}

  function mostraErros(caixa,lista,foca,campos){
    campos.forEach(function(c){
      var el=document.getElementById(c.campo), err=document.getElementById(c.erro);
      var e=lista.filter(function(x){return x.erro===c.erro;})[0];
      if(el&&c.marcar!==false){if(e)el.setAttribute('aria-invalid','true');else el.removeAttribute('aria-invalid');}
      if(err){err.hidden=!e;err.textContent=e?e.msg:'';}
    });
    if(!lista.length){caixa.hidden=true;caixa.innerHTML='';return;}
    caixa.innerHTML='<p>Confira antes de continuar:</p><ul>'+lista.map(function(e){return '<li><a href="#'+e.alvo+'">'+e.msg+'</a></li>';}).join('')+'</ul>';
    caixa.hidden=false;
    caixa.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();var t=document.getElementById(a.getAttribute('href').slice(1));if(t)t.focus();});});
    if(foca)caixa.focus();
  }

  /* ---------- pré-orçamento ---------- */
  var form=document.getElementById('orc');
  if(form){
    var passo=1, caixa=document.getElementById('erros');
    var data=document.getElementById('o-data'), semdata=document.getElementById('o-semdata');
    var faixa=document.getElementById('o-conv-faixa'), conv=document.getElementById('o-conv');
    var nome=document.getElementById('o-nome');
    var radios=form.querySelectorAll('input[name=formato]');
    radios.forEach(function(r,i){r.id='o-formato-'+(i+1);});
    data.min=hojeISO();
    var resultado=document.getElementById('resultado'), msg=document.getElementById('msg');
    var voltar=document.getElementById('voltar'), avancar=document.getElementById('avancar');
    var CAMPOS={1:[{campo:'o-data',erro:'o-data-erro'}],2:[{campo:'o-conv',erro:'o-conv-erro'}],3:[{campo:'o-formato-1',erro:'o-formato-erro',marcar:false}],4:[{campo:'o-nome',erro:'o-nome-erro'}]};
    faixa.addEventListener('input',function(){conv.value=faixa.value;});
    conv.addEventListener('input',function(){var n=parseInt(conv.value,10);if(!isNaN(n))faixa.value=Math.max(50,Math.min(280,n));});
    semdata.addEventListener('change',function(){data.disabled=semdata.checked;});
    function valida(p){
      var e=[];
      if(p===1&&!semdata.checked){
        if(!data.value)e.push({alvo:'o-data',erro:'o-data-erro',msg:'Informe a data do evento ou marque que ainda não há data.'});
        else if(data.value<hojeISO())e.push({alvo:'o-data',erro:'o-data-erro',msg:'Escolha uma data a partir de hoje.'});
      }
      if(p===2){var n=Number(conv.value);if(!conv.value||!Number.isInteger(n)||n<50||n>280)e.push({alvo:'o-conv',erro:'o-conv-erro',msg:'Informe um número inteiro entre 50 e 280 convidados.'});}
      if(p===3&&!form.querySelector('input[name=formato]:checked'))e.push({alvo:'o-formato-1',erro:'o-formato-erro',msg:'Escolha como vai ser a cerimônia.'});
      if(p===4&&!nome.value.trim())e.push({alvo:'o-nome',erro:'o-nome-erro',msg:'Informe seu nome para a mensagem.'});
      return e;
    }
    function mostra(p){
      passo=p;
      form.querySelectorAll('.passo').forEach(function(f){f.hidden=+f.dataset.passo!==p;});
      document.querySelectorAll('#passos li').forEach(function(li){
        var n=+li.dataset.passo; if(n===p)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');
        li.classList.toggle('feito',n<p);
      });
      voltar.hidden=p===1; avancar.textContent=p===4?'Gerar mensagem':'Continuar';
      caixa.hidden=true;
      form.querySelector('.passo[data-passo="'+p+'"] legend').focus();
    }
    function monta(){
      var f=form.querySelector('input[name=formato]:checked').value;
      var s=[].map.call(form.querySelectorAll('input[name=servicos]:checked'),function(c){return c.value;});
      return 'Olá! Vim pelo site e gostaria de um pré-orçamento.\n'+
        'Data do evento: '+(semdata.checked?'ainda sem data definida':br(data.value))+'\n'+
        'Convidados: cerca de '+Number(conv.value)+'\n'+
        'Formato: '+f+'\n'+
        'Serviços de interesse: '+(s.length?s.join(', '):'ainda não sei')+'\n'+
        'Nome: '+nome.value.trim();
    }
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      var e=valida(passo); mostraErros(caixa,e,true,CAMPOS[passo]);
      if(e.length)return;
      if(passo<4){mostra(passo+1);return;}
      msg.textContent=monta();
      document.getElementById('enviar-email').href='mailto:recantodoslagosgaspar@gmail.com?subject='+encodeURIComponent('Pré-orçamento pelo site')+'&body='+encodeURIComponent(msg.textContent);
      resultado.hidden=false; resultado.focus();
    });
    function revalida(){if(!caixa.hidden||form.querySelector('[aria-invalid=true]')||form.querySelector('.passo:not([hidden]) .erro:not([hidden])'))mostraErros(caixa,valida(passo),false,CAMPOS[passo]);}
    form.addEventListener('input',function(ev){if(ev.target.type!=='radio'&&ev.target.type!=='checkbox')revalida();});
    form.addEventListener('change',function(ev){if(ev.target.type==='radio'||ev.target.type==='checkbox')revalida();});
    voltar.addEventListener('click',function(){mostra(passo-1);});
    document.getElementById('enviar').addEventListener('click',function(){abreWhats(msg.textContent);});
    document.getElementById('editar').addEventListener('click',function(){resultado.hidden=true;mostra(1);});
  }

  /* ---------- visita ---------- */
  var vis=document.getElementById('vis');
  if(vis){
    var vcaixa=document.getElementById('vis-erros'), vdata=document.getElementById('v-data');
    vdata.min=hojeISO();
    var vr=vis.querySelectorAll('input[name=periodo]'); vr.forEach(function(r,i){r.id='v-periodo-'+(i+1);});
    var VC=[{campo:'v-data',erro:'v-data-erro'},{campo:'v-periodo-1',erro:'v-periodo-erro',marcar:false}];
    function vvalida(){
      var e=[];
      if(!vdata.value)e.push({alvo:'v-data',erro:'v-data-erro',msg:'Escolha o dia da visita.'});
      else if(vdata.value<hojeISO())e.push({alvo:'v-data',erro:'v-data-erro',msg:'Escolha um dia a partir de hoje.'});
      if(!vis.querySelector('input[name=periodo]:checked'))e.push({alvo:'v-periodo-1',erro:'v-periodo-erro',msg:'Escolha manhã ou tarde.'});
      return e;
    }
    vis.addEventListener('submit',function(ev){
      ev.preventDefault(); var e=vvalida(); mostraErros(vcaixa,e,true,VC); if(e.length)return;
      abreWhats('Olá! Gostaria de visitar o espaço no dia '+br(vdata.value)+', período da '+vis.querySelector('input[name=periodo]:checked').value+'.');
    });
    vis.addEventListener('input',function(ev){if(ev.target.type!=='radio'&&!vcaixa.hidden)mostraErros(vcaixa,vvalida(),false,VC);});
    vis.addEventListener('change',function(ev){if(ev.target.type==='radio'&&!vcaixa.hidden)mostraErros(vcaixa,vvalida(),false,VC);});
  }
})();
