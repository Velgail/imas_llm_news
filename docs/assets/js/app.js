// こたつアイマス速報（GitHub Pages 静的版）クライアントJS
(function(){
  var base = document.body.dataset.base || '';

  // --- 面フィルター（フロントページのみ：ページ遷移せず即時フィルタ）---
  if (document.body.dataset.frontpage) {
    var navs = document.querySelectorAll('.brandnav a');
    var cards = document.querySelectorAll('[data-brand]');
    navs.forEach(function(n){
      n.addEventListener('click', function(e){
        var key = n.getAttribute('data-brand');
        e.preventDefault();
        navs.forEach(function(x){ x.removeAttribute('aria-current'); });
        n.setAttribute('aria-current','true');
        cards.forEach(function(c){
          if (!c.matches('.story, .lead-zone')) return;
          var show = (key === 'all') || (c.getAttribute('data-brand') === key);
          c.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  // --- 検索（search.json をクライアントで検索）---
  var q = document.getElementById('q');
  var sr = document.getElementById('sr');
  if (q && sr) {
    var INDEX = null;
    function load(){ if(INDEX) return Promise.resolve(INDEX);
      return fetch(base + 'search.json').then(function(r){return r.json();}).then(function(d){INDEX=d;return d;}).catch(function(){return [];});
    }
    function render(list){
      if(!list.length){ sr.innerHTML = '<div class="sr-empty">該当する記事はありません。</div>'; return; }
      sr.innerHTML = list.slice(0,8).map(function(a){
        var href = (a.u.charAt(0)==='/' || a.u.indexOf('http')===0) ? a.u : base + a.u;
        var meta = [a.e, a.b, a.k].filter(Boolean).join('／');
        return '<a href="'+href+'"><div class="sr-title">'+a.t+'</div><div class="sr-meta">'+meta+'　'+a.time+'</div></a>';
      }).join('');
    }
    q.addEventListener('input', function(){
      var v = q.value.trim();
      if(!v){ sr.innerHTML=''; return; }
      load().then(function(idx){
        var hit = idx.filter(function(a){ return (a.t+a.l+a.b+(a.tags||[]).join('')).indexOf(v) > -1; });
        render(hit);
      });
    });
    document.addEventListener('click', function(e){ if(!sr.contains(e.target) && e.target!==q){ sr.innerHTML=''; } });
  }
})();