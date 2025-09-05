const base = process.env.KS_BACKEND || process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
const url = `${base.replace(/\/$/,'')}/healthz`;
console.log("Smoke→", url);
fetch(url).then(async r=>{
  console.log("Status:", r.status);
  const j = await r.json().catch(()=> ({}));
  console.log("Body:", j);
  if(r.status!==200) process.exit(1);
}).catch(e=>{
  console.error("Smoke fail:", e.message);
  process.exit(1);
});

