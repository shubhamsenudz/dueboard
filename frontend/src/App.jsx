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
function ClientsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/clients").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/clients",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/clients/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Clients</h2>
    <p className="muted">Add a GSTIN to start the due board.</p>
    <form className="grid-form" onSubmit={save}>
        <label>Client<input value={form.name ?? ""} onChange={ev => setForm({...form, name: ev.target.value})} /></label>
        <label>GSTIN<input value={form.gstin ?? ""} onChange={ev => setForm({...form, gstin: ev.target.value})} /></label>
        <label>Phone<input value={form.phone ?? ""} onChange={ev => setForm({...form, phone: ev.target.value})} /></label>
        <label>Filing type<input value={form.filingType ?? ""} onChange={ev => setForm({...form, filingType: ev.target.value})} /></label>
        <label>Status<input value={form.status ?? ""} onChange={ev => setForm({...form, status: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {rows.length===0 ? <div className="empty">Add a GSTIN to start the due board.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Client</th><th>GSTIN</th><th>Phone</th><th>Filing type</th><th>Status</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.name ?? "")}</td><td>{String(row.gstin ?? "")}</td><td>{String(row.phone ?? "")}</td><td>{String(row.filingType ?? "")}</td><td>{String(row.status ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
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
        <div className="table-wrap"><table><thead><tr><th>Flag</th><th>Return</th><th>Period</th><th>Due</th><th></th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.id}><td>{r.flag}</td><td>{r.serviceCode}</td><td>{r.period}</td><td>{r.dueOn}</td>
          <td><button onClick={()=>done(r.id)}>Mark filed</button></td></tr>)}</tbody></table></div>
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
