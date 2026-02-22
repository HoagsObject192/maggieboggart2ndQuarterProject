
(function(){
  const STORAGE_KEY = 'recipeRatings';

  function loadAll(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e){ return {}; }
  }

  function saveAll(obj){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }

  function setRating(recipeId, rating){
    const all = loadAll();
    all[recipeId] = rating;
    saveAll(all);
  }

  function getRating(recipeId){
    return loadAll()[recipeId] || 0;
  }

  function createStyles(){
    if(document.getElementById('ratings-styles')) return;
    const s = document.createElement('style');
    s.id = 'ratings-styles';
      s.textContent = `
     
        .rating-box{
        margin-top:12px;
        background-color:#000000;
        border:2px solid black;
        padding:16px;
        box-sizing:border-box;
        max-width:480px;
        width:100%;
        border-radius:6px;
        min-height:200px
        }

        .rating-box h3
        {margin:0 0 8px 0;
        font-size:16px}

        .recipe-rating
        {
        display:flex;
        flex-wrap:wrap;
        gap:4px;
        align-items:flex-start;
        user-select:none;
        justify-content:center
        }

        .recipe-rating .star
        {
        cursor:pointer;
        color:white;
        transition:color .12s, font-size .12s;
        margin-right:0px;
        background:transparent;
        padding:0px;
        line-height:1;
        font-size:70px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:75px;height:75px;
        border:none;
        flex-shrink:0;
        outline:none
        }
        .recipe-rating .star.enlarged{font-size:85px}
        .recipe-rating .star.rated{color:#FCD639}
        .recipe-rating .clear-btn
        {
        background-color:#fff;
        border:2px solid black;
        padding:8px 12px;
        font-size:14px;
        cursor:pointer;
        border-radius:4px;
        transition:all .12s;
        font-family:"Varela Round",sans-serif;
        flex-basis:100%;
        width:100%
        }
        .recipe-rating .clear-btn:hover
        {
        background-color:#f1d2e1;
        }
      `;
    document.head.appendChild(s);
  }

  function render(container, recipeId){
    createStyles();
    container.innerHTML = '';
    container.setAttribute('role','group');
    container.setAttribute('aria-label','Rate this recipe');
    const current = getRating(recipeId);
    for(let i=1;i<=5;i++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'star';
      btn.dataset.value = i;
      btn.innerText = '★';
      btn.setAttribute('aria-label', i + ' star');
      btn.setAttribute('title', i + ' star');
      if(i <= current) btn.classList.add('rated');

      btn.addEventListener('click', ()=>{
        setRating(recipeId, i);
        updateStars(container, i);
      });

      btn.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });

      btn.addEventListener('mouseover', ()=>{
        const stars = container.querySelectorAll('.star');
        stars.forEach(s=>{
          const v = Number(s.dataset.value);
          if(v <= i) s.classList.add('enlarged');
          else s.classList.remove('enlarged');
        });
      });

      btn.addEventListener('mouseout', ()=>{
        const stars = container.querySelectorAll('.star');
        stars.forEach(s=> s.classList.remove('enlarged'));
      });

      container.appendChild(btn);
    }

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'clear-btn';
    clearBtn.innerText = 'Clear';
    clearBtn.setAttribute('aria-label', 'Clear rating');
    clearBtn.addEventListener('click', ()=>{
      setRating(recipeId, 0);
      updateStars(container, 0);
    });
    container.appendChild(clearBtn);
  }

  function updateStars(container, rating){
    const stars = container.querySelectorAll('.star');
    stars.forEach(s=>{
      const v = Number(s.dataset.value);
      s.classList.toggle('rated', v <= rating);
    });
  }

  function init(){
    const recipeId = (document.body && document.body.dataset && document.body.dataset.recipeId) || location.pathname;
    if(!recipeId) return;
    const containers = document.querySelectorAll('.recipe-rating');
    containers.forEach(c => render(c, recipeId));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
