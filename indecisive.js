/* indecisive.js
   Small quiz to recommend recipes based on form answers.
   Stores last answers in localStorage (per-user) and shows top matches.
*/
(function(){
  const STORAGE_KEY = 'indecisiveAnswers';

  const recipes = [
    {id:'French Fries', url:'French Fries.html', tags:['savory','snack'], meal:'appetizer', time:'quick', veg:true},
    {id:'Mac N Cheese', url:'Mac n Cheese.html', tags:['savory','comfort'], meal:'main', time:'medium', veg:true},
    {id:'Caesar Salad', url:'caesar.html', tags:['savory','fresh'], meal:'appetizer', time:'quick', veg:false},
    {id:'Classic Burger', url:'burger.html', tags:['savory'], meal:'main', time:'medium', veg:false},
    {id:'Chili Garlic Noodles', url:'chiligarlic.html', tags:['spicy','savory'], meal:'main', time:'quick', veg:true},
    {id:'Chocolate Chip Cookies', url:'choccookies.html', tags:['sweet','dessert'], meal:'dessert', time:'medium', veg:true},
    {id:'Cinnamon Rolls', url:'cinnaroll.html', tags:['sweet','dessert'], meal:'dessert', time:'long', veg:true},
    {id:'Tacos', url:'tacos.html', tags:['savory'], meal:'main', time:'medium', veg:false},
    {id:'Jeremiah Cake', url:'jeremiah-cake.html', tags:['sweet','dessert'], meal:'dessert', time:'long', veg:true}
  ];

  function saveAnswers(obj){ localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }
  function loadAnswers(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(e){return{}} }

  function scoreRecipe(r, answers){
    let score = 0;
    if(answers.meal && answers.meal !== 'any' && r.meal === answers.meal) score += 3;
    if(answers.time && answers.time !== 'any' && r.time === answers.time) score += 2;
    if(answers.veg === 'yes' && r.veg) score += 3; if(answers.veg === 'no' && !r.veg) score +=3;
    if(answers.taste && answers.taste !== 'any'){
      if(r.tags.includes(answers.taste)) score += 4;
      else if(answers.taste === 'spicy' && r.tags.includes('savory')) score +=1;
    }
    return score;
  }

  function recommend(answers){
    if(answers.surprise === 'yes'){
      const pick = recipes[Math.floor(Math.random()*recipes.length)];
      return [pick];
    }
    const scored = recipes.map(r=>({r,score:scoreRecipe(r,answers)}));
    scored.sort((a,b)=>b.score - a.score);
    const top = scored.filter(s=>s.score>0).slice(0,3).map(s=>s.r);
    if(top.length===0) return recipes.slice(0,3);
    return top;
  }

  function renderResults(list, container){
    container.innerHTML = '';
    const title = document.createElement('h3'); title.innerText = 'Recommendations'; container.appendChild(title);
    const ul = document.createElement('ul'); ul.style.listStyle='none'; ul.style.padding='0';
    list.forEach(r=>{
      const li = document.createElement('li'); li.style.margin='12px 0';
      const a = document.createElement('a'); a.href = r.url; a.innerText = r.id; a.style.fontSize='18px'; a.style.textDecoration='none'; a.style.color='#333';
      li.appendChild(a);
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function init(){
    const form = document.getElementById('indecisive-form');
    const results = document.getElementById('indecisive-results');
    if(!form || !results) return;
    const saved = loadAnswers();
    // restore
    ['taste','meal','time','veg','surprise'].forEach(k=>{ if(saved[k]){
      const el = form.elements[k]; if(el) el.value = saved[k];
    }});

    function run(){
      const answers = {
        taste: form.elements['taste'].value,
        meal: form.elements['meal'].value,
        time: form.elements['time'].value,
        veg: form.elements['veg'].value,
        surprise: form.elements['surprise'].value
      };
      saveAnswers(answers);
      const recs = recommend(answers);
      renderResults(recs, results);
    }

    form.addEventListener('submit', function(e){ e.preventDefault(); run(); });
    // run on load
    run();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
