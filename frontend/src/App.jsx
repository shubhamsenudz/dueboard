import React, { useEffect, useState } from "react";
async function api(path, opts={}) {
  const token = localStorage.getItem("token");
  const res = await fetch("/api"+path, { ...opts, headers: { "Content-Type":"application/json", ...(token?{Authorization:"Bearer "+token}:{}), ...(opts.headers||{}) } });
  if(!res.ok) throw new Error(await res.text());
  const text = await res.text();
  if(!text) return null;
  return JSON.parse(text);
}
function ClientPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const load=()=>api("/clients").then(setRows);
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); await api("/clients",{method:"POST",body:JSON.stringify(form)}); setForm({}); load();};
  const remove=id=>api("/clients/"+id,{method:"DELETE"}).then(load);
  return (<div className="card"><h2>Clients</h2>
    <form className="grid-form" onSubmit={save}>
        <label>name<input value={form.name ?? ""} onChange={ev => setForm({...form, name: ev.target.value})} /></label>
        <label>gstin<input value={form.gstin ?? ""} onChange={ev => setForm({...form, gstin: ev.target.value})} /></label>
        <label>phone<input value={form.phone ?? ""} onChange={ev => setForm({...form, phone: ev.target.value})} /></label>
        <label>filingType<input value={form.filingType ?? ""} onChange={ev => setForm({...form, filingType: ev.target.value})} /></label>
        <label>status<input value={form.status ?? ""} onChange={ev => setForm({...form, status: ev.target.value})} /></label>
      <button type="submit">Add</button>
    </form>
    <table><thead><tr><th>name</th><th>gstin</th><th>phone</th><th>filingType</th><th>status</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.name ?? "")}</td><td>{String(row.gstin ?? "")}</td><td>{String(row.phone ?? "")}</td><td>{String(row.filingType ?? "")}</td><td>{String(row.status ?? "")}</td><td><button className="link" onClick={()=>remove(row.id)}>Delete</button></td></tr>)}</tbody></table>
  </div>);
}

function TaskPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const load=()=>api("/tasks").then(setRows);
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); await api("/tasks",{method:"POST",body:JSON.stringify(form)}); setForm({}); load();};
  const remove=id=>api("/tasks/"+id,{method:"DELETE"}).then(load);
  return (<div className="card"><h2>Tasks</h2>
    <form className="grid-form" onSubmit={save}>
        <label>clientId<input value={form.clientId ?? ""} onChange={ev => setForm({...form, clientId: ev.target.value})} /></label>
        <label>serviceCode<input value={form.serviceCode ?? ""} onChange={ev => setForm({...form, serviceCode: ev.target.value})} /></label>
        <label>period<input value={form.period ?? ""} onChange={ev => setForm({...form, period: ev.target.value})} /></label>
        <label>dueOn<input value={form.dueOn ?? ""} onChange={ev => setForm({...form, dueOn: ev.target.value})} /></label>
        <label>status<input value={form.status ?? ""} onChange={ev => setForm({...form, status: ev.target.value})} /></label>
      <button type="submit">Add</button>
    </form>
    <table><thead><tr><th>clientId</th><th>serviceCode</th><th>period</th><th>dueOn</th><th>status</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.clientId ?? "")}</td><td>{String(row.serviceCode ?? "")}</td><td>{String(row.period ?? "")}</td><td>{String(row.dueOn ?? "")}</td><td>{String(row.status ?? "")}</td><td><button className="link" onClick={()=>remove(row.id)}>Delete</button></td></tr>)}</tbody></table>
  </div>);
}

function WorkFilePage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const load=()=>api("/work_files").then(setRows);
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); await api("/work_files",{method:"POST",body:JSON.stringify(form)}); setForm({}); load();};
  const remove=id=>api("/work_files/"+id,{method:"DELETE"}).then(load);
  return (<div className="card"><h2>WorkFiles</h2>
    <form className="grid-form" onSubmit={save}>
        <label>taskId<input value={form.taskId ?? ""} onChange={ev => setForm({...form, taskId: ev.target.value})} /></label>
        <label>fileName<input value={form.fileName ?? ""} onChange={ev => setForm({...form, fileName: ev.target.value})} /></label>
        <label>kind<input value={form.kind ?? ""} onChange={ev => setForm({...form, kind: ev.target.value})} /></label>
      <button type="submit">Add</button>
    </form>
    <table><thead><tr><th>taskId</th><th>fileName</th><th>kind</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.taskId ?? "")}</td><td>{String(row.fileName ?? "")}</td><td>{String(row.kind ?? "")}</td><td><button className="link" onClick={()=>remove(row.id)}>Delete</button></td></tr>)}</tbody></table>
  </div>);
}
function Dashboard(){
  const [data,setData]=useState(null);
  useEffect(()=>{ api("/dashboard").then(setData).catch(()=>{}); },[]);
  return (<div>
    <div className="hero">
      <div className="stat"><span className="muted">Product</span><b>DueBoard</b></div>
      <div className="stat"><span className="muted">Workspace</span><b>{data?.tenant || "—"}</b></div>
      <div className="stat"><span className="muted">Region</span><b>ap-south-1</b></div>
    </div>
    <div className="card"><p>{data?.tag || "GST, TDS, ITR and ROC due board for 2-8 person CA / GSTP shops."}</p></div>
  </div>);
}
export default function App(){
  const [token,setToken]=useState(localStorage.getItem("token"));
  const [page,setPage]=useState("dashboard");
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({tenantName:"",city:"Mumbai",fullName:"",email:"",password:""});
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
    return (<div className="auth card">
      <h1>DueBoard</h1><p className="muted">GST, TDS, ITR and ROC due board for 2-8 person CA / GSTP shops.</p>
      <form onSubmit={submit} className="grid-form">
        {mode==="register" && <>
          <label>Workspace<input value={form.tenantName} onChange={e=>setForm({...form,tenantName:e.target.value})} required /></label>
          <label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></label>
          <label>Your name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required /></label>
        </>}
        <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></label>
        <button type="submit">{mode==="register"?"Create workspace":"Log in"}</button>
      </form>
      {err && <p className="muted">{err}</p>}
      <button className="link" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Create a workspace":"Have an account? Log in"}</button>
    </div>);
  }
  let body = <Dashboard />;
  if(page==="clients") body = <ClientPage />;
  if(page==="tasks") body = <TaskPage />;
  if(page==="work_files") body = <WorkFilePage />;
  return (<div>
    <div className="top"><div className="brand">DueBoard</div><button onClick={()=>{localStorage.removeItem("token"); setToken(null);}}>Log out</button></div>
    <div className="layout">
      <nav>
          <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Home</button>
          <button className={page==="clients"?"active":""} onClick={()=>setPage("clients")}>Clients</button>
          <button className={page==="tasks"?"active":""} onClick={()=>setPage("tasks")}>Tasks</button>
          <button className={page==="work_files"?"active":""} onClick={()=>setPage("work_files")}>WorkFiles</button>
      </nav>
      <main>{body}</main>
    </div>
  </div>);
}
