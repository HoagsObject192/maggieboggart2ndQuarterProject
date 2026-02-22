
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
        border-radius:6px
        }

        .rating-box h3
        {margin:0 0 8px 0;
        font-size:16px}

        .recipe-rating
        {
        display:flex;
        gap:8px;
        align-items:center;
        user-select:none;
        justify-content:flex-start
        }

        .recipe-rating .star
        {
        cursor:pointer;
        color:#ccc;
        transition:color .12s;
        margin-right:6px;
        border:none;
        background:transparent;
        padding:2px;
        line-height:1;
        font-size:80px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:80px;height:80px}
        .recipe-rating .star.rated{color:orange}
        .recipe-rating .star:focus{outline:3px solid #ddd}
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
          const prev = getRating(recipeId);
          const newRating = (prev === i) ? 0 : i; 
          setRating(recipeId, newRating);
          updateStars(container, newRating);
        });

      btn.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });

      btn.addEventListener('mouseover', ()=> highlight(container, i));
      btn.addEventListener('focus', ()=> highlight(container, i));
      btn.addEventListener('mouseout', ()=> highlight(container, 0));
      btn.addEventListener('blur', ()=> highlight(container, 0));

      container.appendChild(btn);
    }
  }

  function updateStars(container, rating){
    const stars = container.querySelectorAll('.bow');
    stars.forEach(s=>{
      const v = Number(s.dataset.value);
      s.classList.toggle('rated', v <= rating);
    });
  }

  function highlight(container, upto){
    const stars = container.querySelectorAll('.bow');
    stars.forEach(s=>{
      const v = Number(s.dataset.value);
      s.classList.toggle('rated', v <= upto || (upto===0 && s.classList.contains('rated')) );
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
