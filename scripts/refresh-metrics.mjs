// Refresh exact, previously verified records. Secrets remain in the local process.
import fs from 'node:fs/promises';
import { safeUrl } from '../dist/assets/catalog.mjs';
const file='data/resources.json';
const data=JSON.parse(await fs.readFile(file,'utf8'));
const checkedAt=new Date().toISOString().slice(0,10);
const jobs=new Map();
const normalize=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
for(const r of data.resources){
  if(r.links.code && new URL(r.links.code).hostname==='github.com'){
    const repository=new URL(r.links.code).pathname.split('/').filter(Boolean).slice(0,2).join('/');
    if(/^[\w.-]+\/[\w.-]+$/.test(repository))jobs.set(`github:${repository}`,{kind:'github',repository,url:`https://api.github.com/repos/${repository}`});
  }
  const metric=r.metrics?.citations;
  if(metric?.source==='OpenAlex' && /^https:\/\/openalex\.org\/W\d+$/.test(metric.sourceUrl))jobs.set(`citations:${metric.sourceUrl}`,{kind:'citations',source:'OpenAlex',sourceUrl:metric.sourceUrl,url:`https://api.openalex.org/works/${metric.sourceUrl.split('/').pop()}`,title:metric.recordTitle});
  if(metric?.source==='Crossref' && metric.sourceUrl.startsWith('https://doi.org/'))jobs.set(`citations:${metric.sourceUrl}`,{kind:'citations',source:'Crossref',sourceUrl:metric.sourceUrl,url:`https://api.crossref.org/works/${metric.sourceUrl.slice(16)}`,title:metric.recordTitle});
}
const results=new Map();
async function refresh([key,job]){
  try{
    const url=new URL(job.url);const headers={'User-Agent':'Awesome-Game-Embodied-Agents/1.0','Accept':'application/json'};
    if(job.kind==='github' && process.env.GITHUB_TOKEN)headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
    if(job.source==='OpenAlex' && process.env.OPENALEX_API_KEY)url.searchParams.set('api_key',process.env.OPENALEX_API_KEY);
    const response=await fetch(url,{headers,signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const body=await response.json();let value,metric;
    if(job.kind==='github'){
      value=body.stargazers_count;
      if(!safeUrl(body.html_url) || new URL(body.html_url).hostname!=='github.com')throw new Error('Unexpected repository URL');
      metric={value,source:'GitHub',sourceUrl:body.html_url+'/stargazers',repository:body.full_name,updatedAt:checkedAt};
    }else{
      const record=job.source==='Crossref'?body.message:body;
      const title=job.source==='Crossref'?record.title?.[0]:record.title;
      if(!title || normalize(title)!==normalize(job.title))throw new Error('Indexed title changed; review required');
      value=job.source==='Crossref'?record['is-referenced-by-count']:record.cited_by_count;
      metric={value,source:job.source,sourceUrl:job.sourceUrl,updatedAt:checkedAt,recordTitle:title};
    }
    if(!Number.isInteger(value)||value<0)throw new Error('Missing count');
    results.set(key,metric);
  }catch(error){console.warn(`Kept previous snapshot for ${key}: ${error.name==='TimeoutError'?'request timed out':String(error.message).replace(/api_key=[^&\s]+/g,'api_key=[redacted]')}`);}
}
const queue=[...jobs];let next=0;
async function worker(){while(next<queue.length)await refresh(queue[next++]);}
await Promise.all([worker(),worker(),worker(),worker()]);
for(const r of data.resources){
  if(r.links.code){const repo=new URL(r.links.code).pathname.split('/').filter(Boolean).slice(0,2).join('/');const metric=results.get(`github:${repo}`);if(metric)(r.metrics||={}).github=metric;}
  const metric=results.get(`citations:${r.metrics?.citations?.sourceUrl}`);if(metric)r.metrics.citations=metric;
}
await fs.writeFile(file,JSON.stringify(data,null,2)+'\n');
console.log(`Refreshed ${results.size} of ${jobs.size} source records. Run npm run build and npm run check before publishing.`);
