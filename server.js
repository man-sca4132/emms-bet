const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const fixtures = [
  {id:1, league:"Premier League", time:"15:00", home:"Arsenal", away:"Chelsea", markets:["1","X","2"], odds:["1.72","3.80","4.60"]},
  {id:2, league:"Premier League", time:"17:30", home:"Liverpool", away:"Man City", markets:["1","X","2"], odds:["2.45","3.55","2.65"]},
  {id:3, league:"La Liga", time:"19:00", home:"Barcelona", away:"Real Madrid", markets:["1","X","2"], odds:["2.10","3.70","3.05"]},
  {id:4, league:"Serie A", time:"20:45", home:"Inter Milan", away:"AC Milan", markets:["1","X","2"], odds:["1.95","3.40","3.70"]},
  {id:5, league:"NBA", time:"02:00", home:"Lakers", away:"Warriors", markets:["1","2"], odds:["1.83","2.05"]}
];

app.get("/api/fixtures", (_,res)=>res.json(fixtures));
app.get("/api/health", (_,res)=>res.json({ok:true, service:"EMMSBET", mode:"demo"}));

app.post("/api/auth/register", (req,res)=>{
  const {name,email} = req.body || {};
  if(!name || !email) return res.status(400).json({error:"Name and email are required"});
  res.json({ok:true,message:"Demo account created",user:{name,email,balance:0}});
});

app.post("/api/wallet/deposit", (req,res)=>{
  const amount = Number(req.body?.amount);
  if(!amount || amount < 10) return res.status(400).json({error:"Minimum demo deposit is KSh 10"});
  res.json({ok:true,mode:"demo",message:`Demo deposit of KSh ${amount.toLocaleString()} created`});
});

app.post("/api/wallet/withdraw", (req,res)=>{
  const amount = Number(req.body?.amount);
  if(!amount || amount < 10) return res.status(400).json({error:"Minimum demo withdrawal is KSh 10"});
  res.json({ok:true,mode:"demo",message:`Demo withdrawal of KSh ${amount.toLocaleString()} requested`});
});

app.get("*", (_,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`EMMSBET running at http://localhost:${PORT}`));
