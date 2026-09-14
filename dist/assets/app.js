import { renderCard, filterResources, escapeHtml } from './catalog.mjs';
const $ = s => document.querySelector(s);
const state = {view:'all',domain:'all',topic:'all',year:'all',sort:'featured',query:'',candidates:false};
const labels = {all:'全部资源',papers:'精选论文',projects:'开源项目',benchmarks:'评测与环境',about:'收录标准与来源'};
let data;
function readHash() {
  const [view,query=''] = location.hash.slice(1).split('?');
  const p = new URLSearchParams(query);
  state.view = Object.hasOwn(labels, view) ? view : 'all';
  state.domain = ['game','embodied'].includes(p.get('domain')) ? p.get('domain') : 'all';
  state.query = p.get('q') || '';
  state.topic = p.get('topic') || 'all';
  state.year = p.get('year') || 'all';
  state.sort = ['newest','name'].includes(p.get('sort')) ? p.get('sort') : 'featured';
  state.candidates = p.get('candidates') === '1';
}
function syncUrl() {
  const p = new URLSearchParams();
  for (const [key,value] of Object.entries({domain:state.domain,q:state.query,topic:state.topic,year:state.year,sort:state.sort})) if (value && !['all','featured'].includes(value)) p.set(key,value);
  if(state.candidates) p.set('candidates','1');
  history.replaceState(null,'',`#${state.view}${p.size?'?'+p:''}`);
}
function render() {
  if (!data) return;
  const about = state.view === 'about';
  $('#catalogue').hidden = about;
  $('#about').hidden = !about;
  $('#breadcrumb').textContent = labels[state.view];
  document.querySelectorAll('[data-view]').forEach(el=>{const active=el.dataset.view===state.view;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
  document.title = `${labels[state.view]} · Game × Embodied Agents`;
  if(about) return;
  $('#section-title').textContent = state.candidates ? '待核验候选' : state.view==='all'?'探索资源':labels[state.view];
  document.querySelectorAll('[data-domain]').forEach(b=>{const active=b.dataset.domain===state.domain;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  $('#search').value=state.query;$('#topic').value=state.topic;$('#year').value=state.year;$('#sort').value=state.sort;
  const results = filterResources(data.resources,state);
  const total=data.resources.filter(r=>r.status===(state.candidates?'candidate':'selected')&&(state.view==='all'||r.kinds.includes(state.view))).length;
  $('#result-count').textContent=`${results.length} 条${state.candidates?'候选':'资源'} / ${total} 条${state.candidates?'待核验':'收录'}${state.candidates?' · 不计入精选论文':''}`;
  $('#reset').hidden = ![state.query,state.domain!=='all',state.topic!=='all',state.year!=='all',state.candidates,state.sort!=='featured'].some(Boolean);
  $('#candidates').hidden = !['all','papers'].includes(state.view);
  $('#candidates').textContent = state.candidates ? '返回精选' : `查看候选 (${data.resources.filter(r=>r.status==='candidate').length})`;
  $('#candidates').setAttribute('aria-pressed',String(state.candidates));
  $('#resources').innerHTML = results.length ? results.map(renderCard).join('') : '<div class="empty-state"><h3>暂时没有匹配的资源</h3><p>试试更短的关键词，或清除筛选条件。</p><button type="button" id="empty-reset">查看全部精选</button></div>';
  $('#empty-reset')?.addEventListener('click',reset);
}
function reset() {Object.assign(state,{view:state.view==='about'?'all':state.view,domain:'all',query:'',topic:'all',year:'all',sort:'featured',candidates:false});syncUrl();render();}
async function init() {
  try {
    const response=await fetch(new URL('../resources.json',import.meta.url));
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    data=await response.json();
    if(!Array.isArray(data.resources))throw new Error('Invalid catalogue');
    const topics=[...new Set(data.resources.filter(r=>r.status==='selected').flatMap(r=>r.tags))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
    $('#topic').innerHTML='<option value="all">全部主题</option>'+topics.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
    const years=[...new Set(data.resources.map(r=>r.year).filter(Boolean))].sort((a,b)=>b-a);
    $('#year').innerHTML='<option value="all">全部年份</option>'+years.map(y=>`<option value="${y}">${y}</option>`).join('');
    const button=document.createElement('button');button.id='candidates';button.type='button';button.className='candidate-toggle';$('.result-line').append(button);
    button.addEventListener('click',()=>{state.candidates=!state.candidates;state.topic='all';state.year='all';syncUrl();render();});
    document.querySelectorAll('[data-domain]').forEach(b=>b.addEventListener('click',()=>{state.domain=b.dataset.domain;syncUrl();render();}));
    $('#search').addEventListener('input',e=>{state.query=e.target.value;syncUrl();render();});
    for(const key of ['topic','year','sort'])$('#'+key).addEventListener('change',e=>{state[key]=e.target.value;syncUrl();render();});
    $('#reset').addEventListener('click',reset);
    window.addEventListener('hashchange',()=>{readHash();render();});
    document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&state.view!=='about'){e.preventDefault();$('#search').focus();}});
    readHash();render();
    const context=document.modelContext;
    if(context?.registerTool){
      const lifetime=new AbortController();
      window.addEventListener('pagehide',()=>lifetime.abort(),{once:true});
      try {
        await context.registerTool({
          name:'filter_research_resources',title:'筛选研究资源',
          description:'按关键词和游戏／具身方向筛选资源，更新页面并返回匹配条目的来源链接。',
          inputSchema:{type:'object',properties:{query:{type:'string',maxLength:300},domain:{type:'string',enum:['all','game','embodied']},kind:{type:'string',enum:['all','papers','projects','benchmarks']}},additionalProperties:false},
          annotations:{readOnlyHint:false,untrustedContentHint:true},
          execute(input){
            if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['query','domain','kind'].includes(k)))throw new Error('Invalid filter object');
            if(input.query!==undefined&&(typeof input.query!=='string'||input.query.length>300))throw new Error('Invalid query');
            if(input.domain!==undefined&&!['all','game','embodied'].includes(input.domain))throw new Error('Invalid domain');
            if(input.kind!==undefined&&!['all','papers','projects','benchmarks'].includes(input.kind))throw new Error('Invalid resource kind');
            Object.assign(state,{query:input.query||'',domain:input.domain||'all',view:input.kind||'all',topic:'all',year:'all',sort:'featured',candidates:false});
            syncUrl();render();
            const results=filterResources(data.resources,state);
            return {count:results.length,resources:results.map(({id,name,venue,links})=>({id,name,venue,links}))};
          }
        },{signal:lifetime.signal});
      }catch(error){console.warn('Optional research tool unavailable',error);}
    }
  } catch(error) {
    $('#result-count').textContent='交互目录暂时未加载。你仍可浏览下方静态精选，刷新页面后重试。';
    $('.controls').hidden=true;$('.filter-line').hidden=true;
    console.error('Catalogue could not be loaded:',error);
  }
}
init();
