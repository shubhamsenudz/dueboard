import React, { useEffect, useState } from "react";
function parseErr(t){ try{ const j=JSON.parse(t); return j.error||t; }catch{ return t||"Request failed"; } }
async function api(path, opts={}) {
  const token = localStorage.getItem("token");
  const res = await fetch((import.meta.env.VITE_API_URL||"")+"/api"+path, {
    ...opts,
    headers: { "Content-Type":"application/json", ...(token?{Authorization:"Bearer "+token}:{}), ...(opts.headers||{}) }
  });
  const text = await res.text();
  if(!res.ok) throw new Error(parseErr(text));
  if(!text) return null;
  return JSON.parse(text);
}
function downloadCsv(name, rows) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]).filter(k => k !== "tenantId");
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => String(r[k]??"").replaceAll(","," ")).join(","))].join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"})); a.download = name+".csv"; a.click();
}
function useTools({kind, rows, onImported}) {
  const [csv,setCsv]=useState(""); const [q,setQ]=useState("");
  const shown = (rows||[]).filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  async function imp(){ await api("/import/"+kind,{method:"POST",body:JSON.stringify({csv})}); setCsv(""); onImported(); }
  return {shown, bar: (<div className="tools"><input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} /><button type="button" className="ghost-ink" onClick={()=>downloadCsv(kind, shown)}>Download CSV</button><textarea rows={2} placeholder="Paste CSV" value={csv} onChange={e=>setCsv(e.target.value)} /><button type="button" onClick={imp}>Import Excel/CSV</button></div>)};
}
function printSheet(title, html){
  const w=window.open("", "_blank");
  if(!w) return;
  w.document.write("<html><head><title>"+title+"</title><style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:6px;text-align:left}</style></head><body>"+html+"</body></html>");
  w.document.close(); w.focus(); w.print();
}
function TeamPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({fullName:"",email:"",password:""});
  const [pw,setPw]=useState({oldPassword:"",newPassword:""});
  const [msg,setMsg]=useState("");
  const load=()=>api("/team").then(setRows).catch(()=>{});
  useEffect(()=>{load();},[]);
  async function invite(ev){ ev.preventDefault(); await api("/team",{method:"POST",body:JSON.stringify(form)}); setForm({fullName:"",email:"",password:""}); setMsg("Staff added."); load(); }
  async function changePw(ev){ ev.preventDefault(); await api("/me/password",{method:"POST",body:JSON.stringify(pw)}); setMsg("Password changed."); setPw({oldPassword:"",newPassword:""}); }
  return (<section className="card"><h2>Team</h2>
    <p className="muted">Owner can add staff. Staff share the same workspace data.</p>
    <form className="grid-form" onSubmit={invite}>
      <label>Name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} /></label>
      <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
      <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} minLength={8} required /></label>
      <button>Add staff</button>
    </form>
    <form className="grid-form" onSubmit={changePw}>
      <label>Current password<input type="password" value={pw.oldPassword} onChange={e=>setPw({...pw,oldPassword:e.target.value})} /></label>
      <label>New password<input type="password" value={pw.newPassword} onChange={e=>setPw({...pw,newPassword:e.target.value})} minLength={8} /></label>
      <button>Change password</button>
    </form>
    {msg && <p className="muted">{msg}</p>}
    <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
    <tbody>{rows.map(r=><tr key={r.id}><td>{r.fullName}</td><td>{r.email}</td><td>{r.role}</td></tr>)}</tbody></table></div>
  </section>);
}
function ActivityPage(){
  const [rows,setRows]=useState([]);
  useEffect(()=>{ api("/activity").then(setRows).catch(()=>{}); },[]);
  return (<section className="card"><h2>Activity</h2>
    {rows.length===0 ? <div className="empty">No activity yet.</div> : (
      <div className="table-wrap"><table><thead><tr><th>When</th><th>Who</th><th>Action</th><th>Detail</th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.id}><td>{String(r.createdAt||"").slice(0,19)}</td><td>{r.actor}</td><td>{r.action}</td><td>{r.detail}</td></tr>)}</tbody></table></div>
    )}
  </section>);
}
function SettingsPage(){
  const [form,setForm]=useState({name:"",city:"",phone:"",gstin:"",upiVpa:"",whatsapp:"",address:"",reminderTemplate:""});
  const [msg,setMsg]=useState("");
  useEffect(()=>{ api("/settings").then(s=>setForm({
    name:s.name||"", city:s.city||"", phone:s.phone||"", gstin:s.gstin||"",
    upiVpa:s.upiVpa||"", whatsapp:s.whatsapp||"", address:s.address||"", reminderTemplate:s.reminderTemplate||""
  })); },[]);
  async function save(ev){ ev.preventDefault(); await api("/settings",{method:"PUT",body:JSON.stringify(form)}); setMsg("Saved UPI, WhatsApp and reminder template."); }
  return (<section className="card"><h2>Workspace settings</h2>
    <p className="muted">UPI VPA is used on receipts and chase messages. Template can use {"{name}"}, {"{amount}"}, {"{extra}"}.</p>
    <form className="grid-form" onSubmit={save}>
      <label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></label>
      <label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></label>
      <label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></label>
      <label>GSTIN<input value={form.gstin} onChange={e=>setForm({...form,gstin:e.target.value})} /></label>
      <label>UPI VPA<input value={form.upiVpa} onChange={e=>setForm({...form,upiVpa:e.target.value})} placeholder="name@upi" /></label>
      <label>WhatsApp<input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} /></label>
      <label>Address<input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></label>
      <label>Reminder template<textarea rows={2} value={form.reminderTemplate} onChange={e=>setForm({...form,reminderTemplate:e.target.value})} /></label>
      <button>Save settings</button>
    </form>
    {msg && <p className="muted">{msg}</p>}
  </section>);
}
function ClientsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/clients").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const tools=useTools({kind:"clients", rows, onImported:load});
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/clients",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/clients/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Clients</h2>
    <p className="muted">Add a GSTIN to start the due board.</p>
    {tools.bar}
    <form className="grid-form" onSubmit={save}>
        <label>Client<input value={form.name ?? ""} onChange={ev => setForm({...form, name: ev.target.value})} /></label>
        <label>GSTIN<input value={form.gstin ?? ""} onChange={ev => setForm({...form, gstin: ev.target.value})} /></label>
        <label>Phone<input value={form.phone ?? ""} onChange={ev => setForm({...form, phone: ev.target.value})} /></label>
        <label>Filing type<input value={form.filingType ?? ""} onChange={ev => setForm({...form, filingType: ev.target.value})} /></label>
        <label>Status<input value={form.status ?? ""} onChange={ev => setForm({...form, status: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {tools.shown.length===0 ? <div className="empty">Add a GSTIN to start the due board.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Client</th><th>GSTIN</th><th>Phone</th><th>Filing type</th><th>Status</th><th></th></tr></thead>
    <tbody>{tools.shown.map(row=><tr key={row.id}><td>{String(row.name ?? "")}</td><td>{String(row.gstin ?? "")}</td><td>{String(row.phone ?? "")}</td><td>{String(row.filingType ?? "")}</td><td>{String(row.status ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
  </section>);
}

function DuetasksPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/tasks").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/tasks",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/tasks/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Due tasks</h2>
    <p className="muted">No filings on the board.</p>
    <form className="grid-form" onSubmit={save}>
        <label>Client id<input value={form.clientId ?? ""} onChange={ev => setForm({...form, clientId: ev.target.value})} /></label>
        <label>Return<input value={form.serviceCode ?? ""} onChange={ev => setForm({...form, serviceCode: ev.target.value})} /></label>
        <label>Period<input value={form.period ?? ""} onChange={ev => setForm({...form, period: ev.target.value})} /></label>
        <label>Due date<input value={form.dueOn ?? ""} onChange={ev => setForm({...form, dueOn: ev.target.value})} /></label>
        <label>Status<input value={form.status ?? ""} onChange={ev => setForm({...form, status: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {rows.length===0 ? <div className="empty">No filings on the board.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Client id</th><th>Return</th><th>Period</th><th>Due date</th><th>Status</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.clientId ?? "")}</td><td>{String(row.serviceCode ?? "")}</td><td>{String(row.period ?? "")}</td><td>{String(row.dueOn ?? "")}</td><td>{String(row.status ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
  </section>);
}

function WorkingpapersPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/work_files").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/work_files",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/work_files/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Working papers</h2>
    <p className="muted">Attach Tally backups and workings.</p>
    <form className="grid-form" onSubmit={save}>
        <label>Task id<input value={form.taskId ?? ""} onChange={ev => setForm({...form, taskId: ev.target.value})} /></label>
        <label>File name<input value={form.fileName ?? ""} onChange={ev => setForm({...form, fileName: ev.target.value})} /></label>
        <label>Kind<input value={form.kind ?? ""} onChange={ev => setForm({...form, kind: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {rows.length===0 ? <div className="empty">Attach Tally backups and workings.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Task id</th><th>File name</th><th>Kind</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.taskId ?? "")}</td><td>{String(row.fileName ?? "")}</td><td>{String(row.kind ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
  </section>);
}
function Dashboard(){
  const [w,setW]=useState(null);
  const [msg,setMsg]=useState("");
  const load=()=>api("/work").then(setW).catch(()=>{});
  useEffect(()=>{load();},[]);
  async function seed(){ const r=await api("/work/seed-month",{method:"POST",body:"{}"}); setMsg("Created "+r.created+" GST tasks"); load(); }
  async function done(id){ await api("/tasks/"+id,{method:"PUT",body:JSON.stringify({status:"FILED"})}); load(); }
  const rows=[...(w?.overdue||[]).map(r=>({...r,flag:"Overdue"})), ...(w?.dueSoon||[]).map(r=>({...r,flag:"This week"}))];
  return (<div>
    <div className="hero-panel">
      <div className="kicker">Today</div>
      <h1>Filing board</h1>
      <p>Seed GSTR-1 and 3B for this month, then mark filed.</p>
      <button onClick={seed}>Create this month's GST tasks</button>
    </div>
    <div className="hero">
      <div className="stat"><span>Open</span><b>{w?.open ?? 0}</b></div>
      <div className="stat"><span>Overdue</span><b>{(w?.overdue||[]).length}</b></div>
      <div className="stat"><span>Due in 7 days</span><b>{(w?.dueSoon||[]).length}</b></div>
    </div>
    {msg && <p className="muted">{msg}</p>}
    <section className="card">
      <h2>Work queue</h2>
      {rows.length===0 ? <div className="empty">Add clients, then seed this month.</div> : (
        <div className="table-wrap"><table><thead><tr><th>Flag</th><th>Client</th><th>Return</th><th>Period</th><th>Due</th><th></th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.id}><td>{r.flag}</td><td>{r.clientName||r.serviceCode}</td><td>{r.serviceCode}</td><td>{r.period}</td><td>{r.dueOn}</td>
          <td><button onClick={()=>done(r.id)}>Mark filed</button>
            {r.waLink && <a className="wa" href={r.waLink} target="_blank" rel="noreferrer">WhatsApp</a>}</td></tr>)}</tbody></table></div>
      )}
    </section>
  </div>);
}
export default function App(){
  const [token,setToken]=useState(localStorage.getItem("token"));
  const [menu,setMenu]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({tenantName:"",city:"Pune",fullName:"",email:"",password:""});
  const [err,setErr]=useState("");
  async function submit(ev){
    ev.preventDefault(); setErr("");
    try{
      const path = mode==="register"?"/auth/register":"/auth/login";
      const body = mode==="register"?form:{email:form.email,password:form.password};
      const out = await api(path,{method:"POST",body:JSON.stringify(body)});
      localStorage.setItem("token", out.token); setToken(out.token);
    }catch(e){ setErr(e.message); }
  }
  if(!token){
    return (<div className="auth-wrap">
      <div className="auth">
        <div className="kicker">For CA and GSTP firms</div>
        <h1>DueBoard</h1>
        <p className="muted">See every GST, TDS, ITR and ROC due before it becomes a penalty.</p>
        <form onSubmit={submit} className="grid-form">
          {mode==="register" && <>
            <label>Workspace<input value={form.tenantName} onChange={e=>setForm({...form,tenantName:e.target.value})} required /></label>
            <label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></label>
            <label>Your name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required /></label>
          </>}
          <label>Email<input type="email" autoComplete="username" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
          <label>Password<input type="password" autoComplete={mode==="login"?"current-password":"new-password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8} /></label>
          <button type="submit">{mode==="register"?"Open workspace":"Log in"}</button>
        </form>
        {err && <p className="err">{err}</p>}
        <button className="ghost-ink" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Create a workspace":"Have an account? Log in"}</button>
      </div>
    </div>);
  }
  let body = <Dashboard />;
  if(page==="clients") body = <ClientsPage />;
  if(page==="tasks") body = <DuetasksPage />;
  if(page==="work_files") body = <WorkingpapersPage />;
  if(page==="settings") body = <SettingsPage />;
  if(page==="team") body = <TeamPage />;
  if(page==="activity") body = <ActivityPage />;
  return (<div className="shell">
    <div className="top">
      <button type="button" className="burger" onClick={()=>setMenu(v=>!v)}>Menu</button>
      <div className="brand">DueBoard</div>
      <button className="ghost" onClick={()=>{localStorage.removeItem("token"); setToken(null);}}>Log out</button>
    </div>
    <div className="layout">
      {menu && <button className="scrim" onClick={()=>setMenu(false)} />}
      <nav className={"side"+(menu?" open":"")} onClick={()=>setMenu(false)}>
          <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Home</button>
          <button className={page==="clients"?"active":""} onClick={()=>setPage("clients")}>Clients</button>
          <button className={page==="tasks"?"active":""} onClick={()=>setPage("tasks")}>Due tasks</button>
          <button className={page==="work_files"?"active":""} onClick={()=>setPage("work_files")}>Working papers</button>
          <button className={page==="settings"?"active":""} onClick={()=>setPage("settings")}>Settings</button>
          <button className={page==="team"?"active":""} onClick={()=>setPage("team")}>Team</button>
          <button className={page==="activity"?"active":""} onClick={()=>setPage("activity")}>Activity</button>
      </nav>
      <main>{body}</main>
      <nav className="tabs">
          <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Home</button>
          <button className={page==="clients"?"active":""} onClick={()=>setPage("clients")}>Clients</button>
          <button className={page==="tasks"?"active":""} onClick={()=>setPage("tasks")}>Due tasks</button>
          <button className={page==="work_files"?"active":""} onClick={()=>setPage("work_files")}>Working papers</button>
      </nav>
    </div>
  </div>);
}
