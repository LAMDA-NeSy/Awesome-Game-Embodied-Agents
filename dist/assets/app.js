import { renderCatalogue, filterResources, escapeHtml } from './catalog.mjs?v=94a5b3470e1c';
const $ = s => document.querySelector(s);
const labels = {all:'All resources',articles:'Research articles',papers:'Papers',projects:'Open-source projects',datasets:'Datasets',benchmarks:'Benchmarks & environments',demos:'Video demos',about:'Collection policy',updates:'What’s new'};
const defaults = {view:'all',domain:'all',topic:'all',year:'all',sort:'featured',query:'',candidates:false,code:false,paperType:'all',demoType:'all'};
const state = {...defaults};
let data;
let videoObserver;
function readHash() {
  const [view, query=''] = location.hash.slice(1).split('?');
  const p = new URLSearchParams(query);
  Object.assign(state, defaults, {
    view: Object.hasOwn(labels,view) ? view : 'all',
    domain: ['game','embodied'].includes(p.get('domain')) ? p.get('domain') : 'all',
    query: p.get('q') || '', topic:p.get('topic') || 'all',year:p.get('year') || 'all',
    sort:p.get('sort')==='newest'?'venue':['venue','date','added','updated','name'].includes(p.get('sort')) ? p.get('sort') : 'featured',
    candidates:p.get('candidates')==='1' && ['all','papers'].includes(view || 'all'), code:p.get('code')==='1',
    paperType:['survey','method','dataset','benchmark'].includes(p.get('paperType')) ? p.get('paperType') : 'all',
    demoType:['game-control','generated-world','real-robot','simulation'].includes(p.get('demoType')) ? p.get('demoType') : 'all'
  });
}
function syncUrl() {
  const p = new URLSearchParams();
  for (const [key,value] of Object.entries({domain:state.domain,q:state.query,topic:state.topic,year:state.year,sort:state.sort,paperType:state.paperType,demoType:state.demoType})) if(value && !['all','featured'].includes(value))p.set(key,value);
  if(state.candidates)p.set('candidates','1');
  if(state.code)p.set('code','1');
  history.replaceState(null,'',`#${state.view}${p.size?'?'+p:''}`);
}
function render() {
  if(!data)return;
  const about = state.view==='about';
  const updates = state.view==='updates';
  $('#catalogue').hidden=about||updates;$('#about').hidden=!about;$('#updates').hidden=!updates;
  document.querySelectorAll('[data-view]').forEach(el=>{
    const active=el.dataset.view===state.view;el.classList.toggle('active',active);
    if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  document.title=`${labels[state.view]} · Awesome Game & Embodied Agents`;
  if(about||updates)return;
  $('#breadcrumb').textContent=state.candidates?'PENDING REVIEW':'THE COLLECTION';
  $('#section-title').textContent=state.candidates?'Candidate papers':labels[state.view];
  for(const key of ['domain','paperType','demoType'])document.querySelectorAll(`[data-${key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}]`).forEach(b=>{const active=b.dataset[key]===state[key];b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  $('#paper-types').hidden=state.view!=='papers';$('#demo-types').hidden=state.view!=='demos';
  $('#demo-note').hidden=state.view!=='demos';
  for(const key of ['topic','year','sort'])$('#'+key).value=state[key];
  $('#search').value=state.query;$('#code-only').checked=state.code;
  const results=filterResources(data.resources,state);
  const total=data.resources.filter(r=>r.status===(state.candidates?'candidate':'selected')&&(state.view==='all'||r.kinds.includes(state.view))).length;
  $('#result-count').textContent=`${results.length} of ${total} ${state.candidates?'candidates · excluded from curated counts':state.view==='all'?'unique resources':state.view==='papers'?'papers':'resources'}`;
  $('#count-note').hidden=state.candidates;
  $('#year-label').textContent=state.view==='papers'?'Venue year':'Year';
  const sortNotes = {
    featured:'Curated order. Paper years refer to the venue; source dates retain their original meaning.',
    venue:'Newest venue / release year first. Paper years refer to the conference or journal year; source dates may differ.',
    date:'Newest displayed source date first. Published, preprint, and indexed dates are labeled; unknown dates appear last.',
    added:'Newest collection additions first. Existing entries share the 14 Sep 2026 baseline; publication dates are separate.',
    updated:'Newest content revisions first. Routine citation/star refreshes do not change the revision date.',
    name:'Alphabetical by project or short paper name.'
  };
  $('#sort-note').textContent=sortNotes[state.sort];
  if(state.topic!=='all'||state.year!=='all'||state.code||state.sort!=='featured')$('#collection-tools').classList.add('filters-open');
  $('#filter-toggle').setAttribute('aria-expanded', String($('#collection-tools').classList.contains('filters-open')));
  $('#reset').hidden=!Object.keys(defaults).some(key=>key!=='view'&&state[key]!==defaults[key]);
  $('#candidates').hidden=!['all','papers'].includes(state.view);
  $('#candidates').textContent=state.candidates?'Back to curated':`Candidates (${data.resources.filter(r=>r.status==='candidate').length})`;
  $('#candidates').setAttribute('aria-pressed',String(state.candidates));
  $('#resources').innerHTML=results.length?renderCatalogue(results,state.view,data.resources,state.sort):'<div class="empty-state"><h3>No matching resources</h3><p>Try a shorter query or clear your filters.</p><button type="button" id="empty-reset">Clear filters</button></div>';
  $('#empty-reset')?.addEventListener('click',reset);
  bindVideos();
  bindCitations();
}
function bindCitations(){
  document.querySelectorAll('.copy-citation').forEach(button=>{button.hidden=false;button.addEventListener('click',async()=>{
    const container=button.closest('.citation-details');
    const status=container.querySelector('.copy-status');
    try{await navigator.clipboard.writeText(container.querySelector('code').textContent);status.textContent='Copied';}
    catch{status.textContent='Select and copy the citation above.';}
  });});
}
function bindVideos(){
  videoObserver?.disconnect();
  videoObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){const v=entry.target;if(!v.dataset.playRequested&&v.readyState===0){v.preload='metadata';v.load();}videoObserver.unobserve(v);}
  },{rootMargin:'180px'}) : null;
  document.querySelectorAll('video').forEach(video=>{
    const button=video.parentElement.querySelector('.video-load');button.hidden=false;
    button.addEventListener('click',async()=>{video.dataset.playRequested='1';videoObserver?.unobserve(video);button.hidden=true;video.closest('.demo-card').querySelector('.video-error').hidden=true;try{await video.play();}catch{button.hidden=false;video.closest('.demo-card').querySelector('.video-error').hidden=false;}});
    if(videoObserver)videoObserver.observe(video);
    video.addEventListener('loadedmetadata',()=>{if(!video.dataset.playRequested&&video.paused&&video.currentTime===0&&video.duration>0.1)video.currentTime=0.1;},{once:true});
    video.addEventListener('error',()=>{const notice=video.closest('.demo-card').querySelector('.video-error');notice.hidden=false;},{once:true});
    video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();}));
  });
}
function reset(){$('#collection-tools').classList.remove('filters-open');const view=['about','updates'].includes(state.view)?'all':state.view;Object.assign(state,defaults,{view});syncUrl();render();}
async function init(){
  try{
    const response=await fetch(new URL('../resources.json',import.meta.url),{cache:'no-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    data=await response.json();if(!Array.isArray(data.resources))throw new Error('Invalid catalogue');
    const topics=[...new Set(data.resources.filter(r=>r.status==='selected').flatMap(r=>r.tags))].sort((a,b)=>a.localeCompare(b,'en'));
    $('#topic').innerHTML='<option value="all">All topics</option>'+topics.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
    const years=[...new Set(data.resources.map(r=>r.year).filter(Boolean))].sort((a,b)=>b-a);
    $('#year').innerHTML='<option value="all">All years</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    for(const key of ['domain','paperType','demoType'])document.querySelectorAll(`[data-${key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())}]`).forEach(b=>b.addEventListener('click',()=>{state[key]=b.dataset[key];syncUrl();render();}));
    $('#search').addEventListener('input',e=>{state.query=e.target.value;syncUrl();render();});
    for(const key of ['topic','year','sort'])$('#'+key).addEventListener('change',e=>{state[key]=e.target.value;syncUrl();render();});
    $('#code-only').addEventListener('change',e=>{state.code=e.target.checked;syncUrl();render();});
    $('#candidates').addEventListener('click',()=>{state.candidates=!state.candidates;state.topic='all';state.year='all';state.paperType='all';syncUrl();render();});
    $('#reset').addEventListener('click',reset);
    $('#filter-toggle').hidden=false;
    $('#filter-toggle').addEventListener('click',()=>{
      const expanded=$('#collection-tools').classList.toggle('filters-open');
      $('#filter-toggle').setAttribute('aria-expanded',String(expanded));
    });
    window.addEventListener('hashchange',()=>{readHash();render();});
    document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!['about','updates'].includes(state.view)){e.preventDefault();$('#search').focus();}});
    readHash();render();
    if(document.modelContext?.registerTool){
      const lifetime=new AbortController();window.addEventListener('pagehide',()=>lifetime.abort(),{once:true});
      try{await document.modelContext.registerTool({name:'filter_research_resources',title:'Filter research resources',description:'Search game and embodied research, datasets, projects, benchmarks, and video demos. Updates the visible catalogue and returns source links.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:300},domain:{type:'string',enum:['all','game','embodied']},kind:{type:'string',enum:Object.keys(labels).filter(k=>!['about','updates'].includes(k))}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){
        if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['query','domain','kind'].includes(k)))throw new Error('Invalid filter object');
        if(input.query!==undefined&&(typeof input.query!=='string'||input.query.length>300))throw new Error('Invalid query');
        if(input.domain!==undefined&&!['all','game','embodied'].includes(input.domain))throw new Error('Invalid domain');
        if(input.kind!==undefined&&(!Object.hasOwn(labels,input.kind)||['about','updates'].includes(input.kind)))throw new Error('Invalid kind');
        Object.assign(state,defaults,{query:input.query||'',domain:input.domain||'all',view:input.kind||'all'});syncUrl();render();
        const results=filterResources(data.resources,state);return {count:results.length,resources:results.map(({id,name,venue,links})=>({id,name,venue,links}))};
      }},{signal:lifetime.signal});}catch(error){console.warn('Optional research tool unavailable',error);}
    }
  }catch(error){
    $('#result-count').textContent='Search is temporarily unavailable. The full curated list remains below; reload to try again.';
    $('.controls').hidden=true;$('.filter-line').hidden=true;$('#candidates').hidden=true;
    console.error('Catalogue could not be loaded:',error);
  }
}
init();
