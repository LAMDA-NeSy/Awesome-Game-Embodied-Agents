const json=(body,status=200)=>new Response(JSON.stringify(body),{
  status,
  headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
});

const validPaperId=value=>typeof value==='string'&&/^[a-z0-9-]{1,80}$/.test(value);
const allowedOrigin=(request,env)=>{
  const origin=request.headers.get('origin')||'';
  return origin===env.ALLOWED_ORIGIN||origin==='http://localhost:4173'||origin==='http://127.0.0.1:4173';
};
const withCors=(response,request,env)=>{
  const headers=new Headers(response.headers);
  const origin=request.headers.get('origin');
  if(origin&&allowedOrigin(request,env))headers.set('access-control-allow-origin',origin);
  headers.set('vary','Origin');
  return new Response(response.body,{status:response.status,headers});
};
const hash=async value=>{
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
};

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==='OPTIONS'){
      if(!allowedOrigin(request,env))return new Response(null,{status:403});
      return withCors(new Response(null,{status:204,headers:{
        'access-control-allow-methods':'GET, POST, OPTIONS',
        'access-control-allow-headers':'content-type',
        'access-control-max-age':'86400'
      }}),request,env);
    }
    if(url.pathname!=='/ratings')return json({error:'Not found'},404);
    if(request.method==='GET'){
      const paperIds=(url.searchParams.get('papers')||'').split(',').filter(Boolean);
      if(!paperIds.length||paperIds.length>80||paperIds.some(id=>!validPaperId(id)))return withCors(json({error:'Invalid paper list'},400),request,env);
      const entries=await Promise.all(paperIds.map(async paperId=>{
        const id=env.RATINGS.idFromName(paperId);
        const response=await env.RATINGS.get(id).fetch('https://ratings.internal/summary');
        return [paperId,await response.json()];
      }));
      return withCors(json({ratings:Object.fromEntries(entries)}),request,env);
    }
    if(request.method==='POST'){
      if(!allowedOrigin(request,env))return withCors(json({error:'Origin not allowed'},403),request,env);
      if(Number(request.headers.get('content-length')||0)>2048)return withCors(json({error:'Request too large'},413),request,env);
      let body;
      try{body=await request.json();}catch{return withCors(json({error:'Invalid JSON'},400),request,env);}
      const {paperId,score,voterId}=body||{};
      if(!validPaperId(paperId)||!Number.isInteger(score)||score<0||score>5||typeof voterId!=='string'||voterId.length<8||voterId.length>128)return withCors(json({error:'Invalid rating'},400),request,env);
      const id=env.RATINGS.idFromName(paperId);
      const response=await env.RATINGS.get(id).fetch('https://ratings.internal/vote',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({score,voterHash:await hash(`${paperId}:${voterId}`)})
      });
      return withCors(response,request,env);
    }
    return withCors(json({error:'Method not allowed'},405),request,env);
  }
};

export class PaperRatings {
  constructor(state){this.state=state;}
  async fetch(request){
    const url=new URL(request.url);
    if(request.method==='GET'&&url.pathname==='/summary')return json(await this.summary());
    if(request.method==='POST'&&url.pathname==='/vote'){
      const {score,voterHash}=await request.json();
      await this.state.storage.transaction(async storage=>{
        const key=`vote:${voterHash}`;
        const previous=await storage.get(key);
        const totals=await storage.get(['sum','count']);
        const sum=Math.max(0,(totals.get('sum')||0)-(Number(previous)||0)+score);
        const count=Math.max(0,(totals.get('count')||0)+(previous===undefined&&score>0?1:0)-(previous!==undefined&&score===0?1:0));
        if(score>0)await storage.put(key,score);else await storage.delete(key);
        await storage.put({sum,count});
      });
      return json(await this.summary());
    }
    return json({error:'Not found'},404);
  }
  async summary(){
    const totals=await this.state.storage.get(['sum','count']);
    const sum=Number(totals.get('sum'))||0;
    const count=Number(totals.get('count'))||0;
    return {average:count?sum/count:0,count};
  }
}
