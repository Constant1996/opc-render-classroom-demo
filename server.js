const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const publicDir = path.join(__dirname, 'public');
const bootId = crypto.randomUUID();
function json(res, status, data) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); }
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if(req.method === 'GET' && url.pathname === '/api/health') return json(res,200,{ok:true,bootId});
    if(req.method === 'GET' && url.pathname === '/api/time') return json(res,200,{time:new Date().toISOString(),bootId,runtime:'Node.js '+process.version});
    if(req.method === 'POST' && url.pathname === '/api/project') {
      let body='';
      for await(const chunk of req) { body+=chunk; if(Buffer.byteLength(body)>8192) return json(res,413,{error:'内容太长，请缩短后重试'}); }
      let data; try { data=JSON.parse(body); } catch { return json(res,400,{error:'请求格式错误'}); }
      if(typeof data.name!=='string'||typeof data.description!=='string'||!data.name.trim()||!data.description.trim()||data.name.length>60||data.description.length>500) return json(res,400,{error:'请填写项目名称（60字内）和简介（500字内）'});
      return json(res,200,{name:data.name.trim(),description:data.description.trim(),characters:data.description.trim().length,message:'服务器已收到并处理你的项目！',time:new Date().toISOString(),id:crypto.randomUUID()});
    }
    if(req.method === 'GET') {
      const assets={'/':'index.html','/style.css':'style.css','/app.js':'app.js'};
      if(assets[url.pathname]) {
        const file=assets[url.pathname];
        const content=await fs.readFile(path.join(publicDir,file));
        res.writeHead(200,{'Content-Type':file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'application/javascript; charset=utf-8'}); return res.end(content);
      }
    }
    json(res,404,{error:'找不到此页面或接口'});
  } catch(e) { console.error(e.message); if(!res.headersSent) json(res,500,{error:'服务器暂时出现问题'}); else res.end(); }
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('OPC demo listening on port '+(process.env.PORT||3000)));
process.on('SIGTERM',()=>server.close());
