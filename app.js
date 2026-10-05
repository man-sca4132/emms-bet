let bets=[];
let fixtures=[];

const $=id=>document.getElementById(id);
function toast(msg){$("toast").textContent=msg;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2600)}
function toggleMenu(){const n=document.querySelector("nav");n.style.display=n.style.display==="flex"?"none":"flex"}
async function loadFixtures(){
  try{
    const r=await fetch("/api/fixtures"); fixtures=await r.json(); renderFixtures();
  }catch(e){toast("Could not load fixtures")}
}
function renderFixtures(){
  $("fixture-list").innerHTML=fixtures.map(f=>`
    <div class="fixture">
      <div class="league"><span>⚽ ${f.league}</span><span>${f.time}</span></div>
      <div class="match">
        <div class="match-time">${f.time}<br><small>Today</small></div>
        <div class="teams2"><b>${f.home}</b><span>vs</span><b>${f.away}</b></div>
        <div class="market-grid">${f.markets.map((m,i)=>`<button class="odd" onclick="addBet('${f.home} ${m==="1"?"Win":m==="2"?"Win":"Draw"}','${f.odds[i]}')">${m}<b>${f.odds[i]}</b></button>`).join("")}</div>
      </div>
    </div>`).join("");
}
function addBet(selection,odd){
  const existing=bets.find(b=>b.selection===selection);
  if(existing){bets=bets.filter(b=>b!==existing);toast("Selection removed");}
  else {bets.push({selection,odd:Number(odd)});toast(`${selection} added to bet slip`)}
  renderSlip();
}
function renderSlip(){
  $("bet-count").textContent=bets.length;
  if(!bets.length){$("slip-items").innerHTML='<div class="empty-slip"><div>🎟️</div><b>Your bet slip is empty</b><span>Tap an odd to add your selection.</span></div>'}
  else $("slip-items").innerHTML=bets.map((b,i)=>`<div class="slip-item"><strong>${b.selection}</strong><small>Odds ${b.odd.toFixed(2)} · <button onclick="removeBet(${i})" style="background:none;color:#d33">Remove</button></small></div>`).join("");
  const total=bets.reduce((a,b)=>a*b.odd,1);
  $("total-odds").textContent=bets.length?total.toFixed(2):"0.00";
  const stake=Number($("stake").value||0); $("return").textContent=bets.length?(stake*total).toFixed(2):"0.00";
}
function removeBet(i){bets.splice(i,1);renderSlip()}
$("stake").addEventListener("input",renderSlip);
function placeBet(){
  if(!bets.length)return toast("Add at least one selection first");
  if(Number($("stake").value)<=0)return toast("Enter a stake");
  toast("Demo bet accepted — no real money was used");
  bets=[];renderSlip();
}
function openModal(type){
  $("modal").classList.add("show");
  $("modal-content").innerHTML=type==="signup"?`
    <h2>Create your EMMSBET account</h2><p style="color:#718096;font-size:13px">Demo account registration</p>
    <div class="form"><label>Name</label><input id="mname" placeholder="Your name"><label>Email</label><input id="memail" type="email" placeholder="you@example.com"><label>Password</label><input type="password" placeholder="••••••••"><button onclick="register()">Create account</button></div>
    <p style="font-size:12px;text-align:center">Already registered? <button onclick="openModal('login')" style="background:none;color:#087f5b">Login</button></p>`
  :`<h2>Welcome back</h2><p style="color:#718096;font-size:13px">Login to your demo account</p><div class="form"><label>Email</label><input type="email" placeholder="you@example.com"><label>Password</label><input type="password" placeholder="••••••••"><button onclick="login()">Login</button></div><p style="font-size:12px;text-align:center">New here? <button onclick="openModal('signup')" style="background:none;color:#087f5b">Create account</button></p>`;
}
function closeModal(){$("modal").classList.remove("show")}
async function register(){
  const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:$("mname").value,email:$("memail").value})});
  const d=await r.json(); if(!r.ok)return toast(d.error); closeModal();toast("Account created successfully");
}
function login(){closeModal();toast("Demo login successful")}
function showPage(page){
  if(page==="home"){location.hash="home";location.reload();return}
  const main=$("main");
  const pages={
    live:`<div class="page-card"><h2>🔴 Live Betting</h2><p>Live markets will appear here when connected to an approved live sports-data feed.</p><div class="action-grid"><div class="action"><b>Live football</b><span>Real-time markets architecture ready.</span></div><div class="action"><b>Live scores</b><span>Connect your licensed data provider.</span></div></div></div>`,
    bets:`<div class="page-card"><h2>🎟️ My Bets</h2><p>Your demo bet history will appear here.</p><div class="action"><b>No settled bets yet</b><span>Place a demo bet from the sportsbook.</span></div></div>`,
    promos:`<div class="page-card"><h2>🎁 Promotions</h2><p>Promotion campaigns can be managed from the admin system.</p><div class="action-grid"><div class="action"><b>Welcome offer</b><span>Configure your approved promotion rules here.</span></div><div class="action"><b>Free bet campaigns</b><span>Connect to your compliant bonus engine.</span></div></div></div>`,
    wallet:`<div class="page-card"><h2>💳 Wallet</h2><p>Demo wallet — no real money processing.</p><div class="action-grid"><div class="action" onclick="walletAction('deposit')"><b>📥 Deposit</b><span>M-Pesa / Airtel Money integration placeholder.</span></div><div class="action" onclick="walletAction('withdraw')"><b>📤 Withdraw</b><span>Withdrawal workflow placeholder.</span></div></div></div>`,
    support:`<div class="page-card"><h2>💬 Customer Care</h2><p>EMMSBET support centre.</p><div class="action-grid"><div class="action"><b>Customer care</b><span>Support number: 0785815485</span></div><div class="action"><b>Live chat</b><span>Connect an approved support provider.</span></div></div></div>`
  };
  main.innerHTML=pages[page]||pages.home;
  window.scrollTo({top:100,behavior:"smooth"});
}
async function walletAction(type){
  const amount=prompt(`Enter demo ${type} amount (KSh):`);
  if(!amount)return;
  const r=await fetch(`/api/wallet/${type}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount})});
  const d=await r.json();toast(d.message||d.error);
}
loadFixtures();
