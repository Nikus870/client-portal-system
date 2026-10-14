/* Orbit Portal app logic — frontend-only demonstration. */
(() => {
  "use strict";
  const STORE_KEY = "orbitPortalStateV1";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n);
  const prettyDate = s => { if(!s) return "—"; const d=new Date(`${s}T12:00:00`); return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
  const initials = n => (n||"U").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let state;
  try { state = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { state = {}; }
  const seed = clone(window.OrbitSeed);
  state = {...seed, ...state, user:{...seed.user,...(state.user||{})}};
  ["clients","projects","documents","tickets","invoices","activities","messages"].forEach(k=>{ if(!Array.isArray(state[k])) state[k]=clone(seed[k]); });
  state.role = state.role || "client";
  let activePage = "dashboard", projectFilter = "all", docFilter = "all", adminTab = "clients", currentConversation = "alex";
  let uploadedFiles = {};
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(e) { toast("Storage limit reached","Try removing uploaded document metadata or resetting demo data.",true); } };
  const projectById = id => state.projects.find(p=>p.id===Number(id));
  const projectName = id => projectById(id)?.name || "General";
  const statusLabel = s => ({"in-progress":"In progress","review":"In review","completed":"Completed","open":"Open","resolved":"Resolved","pending":"Pending","paid":"Paid","overdue":"Overdue"})[s] || s;
  const statusClass = s => ({"in-progress":"pill-progress","review":"pill-review","completed":"pill-completed","open":"pill-open","resolved":"pill-resolved","pending":"pill-pending","paid":"pill-paid","overdue":"pill-overdue"})[s] || "pill-progress";
  const roleName = () => state.role==="admin" ? "Workspace admin" : "Client account";
  function toast(title, message="", error=false) {
    const el=document.createElement("div"); el.className="toast"+(error?" error":"");
    el.innerHTML=`<i class="fa-solid ${error?"fa-circle-exclamation":"fa-circle-check"}"></i><div><strong>${escapeHTML(title)}</strong>${message?`<small>${escapeHTML(message)}</small>`:""}</div>`;
    $("#toastRegion").append(el); setTimeout(()=>el.remove(),3600);
  }
  function addActivity(icon,tone,text) {
    state.activities.unshift({icon,tone,text,time:"Just now"}); state.activities=state.activities.slice(0,12); save();
  }
  function navigate(page) {
    if(!$("#page-"+page)) page="dashboard";
    activePage=page;
    $$(".page-section").forEach(el=>el.classList.toggle("active",el.id==="page-"+page));
    $$(".nav-link[data-page]").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
    $("#breadcrumbPage").textContent=({dashboard:"Overview",projects:"Projects",documents:"Documents",support:"Support center",invoices:"Invoices",messages:"Messages",profile:"My profile",admin:"Admin console"})[page]||page;
    $("#sidebar").classList.remove("open"); $("#overlay").classList.remove("show");
    renderPage(page); window.location.hash=page;
  }
  function renderIdentity() {
    const u=state.user, initialsText=initials(u.name);
    $("#sidebarName").textContent=u.name; $("#sidebarRole").textContent=roleName(); $("#sidebarAvatar").textContent=initialsText; $("#topAvatar").textContent=initialsText;
    $("#welcomeName").textContent=(u.name.split(" ")[0]||"there");
    $("#profileLargeAvatar").textContent=initialsText; $("#profileDisplayName").textContent=u.name; $("#profileDisplayRole").textContent=u.job||"Client account"; $("#profileCompanyLabel").textContent=u.company;
    $("#profileName").value=u.name; $("#profileEmail").value=u.email; $("#profileCompany").value=u.company; $("#profilePhone").value=u.phone; $("#profileJob").value=u.job; $("#profileTimezone").value=u.timezone; $("#emailUpdates").checked=!!u.emailUpdates;
    $$(".admin-only").forEach(el=>el.classList.toggle("hidden",state.role!=="admin"));
  }
  function renderDashboard() {
    const active=state.projects.filter(p=>p.status!=="completed");
    const open=state.tickets.filter(t=>t.status==="open"||t.status==="in-progress");
    const outstanding=state.invoices.filter(i=>i.status==="pending"||i.status==="overdue").reduce((s,i)=>s+i.amount,0);
    $("#statProjects").textContent=active.length; $("#statDocuments").textContent=state.documents.length; $("#statTickets").textContent=open.length; $("#statOutstanding").textContent=money(outstanding).replace(".00","");
    $("#navProjectCount").textContent=active.length; $("#allProjectCount").textContent=state.projects.length;
    $("#todayDate").innerHTML=`<i class="fa-regular fa-calendar"></i> ${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
    $("#recentProjects").innerHTML=state.projects.slice().sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,3).map(p=>`
      <div class="recent-project"><span class="project-symbol symbol-${p.color}"><i class="fa-solid ${p.icon}"></i></span><div class="recent-project-info"><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.category)}</small></div><div class="progress-col"><div class="progress-label"><span>Progress</span><strong>${p.progress}%</strong></div><div class="progress-track"><span style="width:${p.progress}%"></span></div></div><button class="round-arrow" data-action="open-project" data-id="${p.id}" aria-label="Open ${escapeHTML(p.name)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></div>`).join("");
    $("#activityList").innerHTML=state.activities.slice(0,4).map(a=>`<div class="activity-item"><span class="activity-icon ${a.tone}"><i class="fa-solid ${a.icon}"></i></span><div class="activity-copy">${a.text}<small>${escapeHTML(a.time)}</small></div></div>`).join("");
    const milestones=state.projects.filter(p=>p.status!=="completed").sort((a,b)=>a.due.localeCompare(b.due)).slice(0,3);
    $("#milestoneList").innerHTML=milestones.map(p=>{const d=new Date(p.due+"T12:00:00");return `<div class="milestone"><div class="milestone-date"><strong>${d.getDate()}</strong><small>${d.toLocaleDateString("en-US",{month:"short"})}</small></div><div class="milestone-copy"><strong>${escapeHTML(p.milestones?.[1]||"Project milestone")}</strong><small>${escapeHTML(p.name)}</small></div><span class="milestone-tag">${p.status==="review"?"For review":"Upcoming"}</span></div>`}).join("")||'<p class="empty-state">No upcoming milestones.</p>';
  }
  function renderProjects() {
    const query=($("#globalSearch").value||"").toLowerCase().trim();
    let list=state.projects.filter(p=>(projectFilter==="all"||p.status===projectFilter)&&(!query||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query)));
    const sort=$("#projectSort")?.value||"recent";
    if(sort==="progress") list.sort((a,b)=>b.progress-a.progress);
    else if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    else list.sort((a,b)=>b.updated.localeCompare(a.updated));
    $("#projectGrid").innerHTML=list.map(p=>`<article class="project-card"><div class="project-card-top"><div class="project-card-title"><span class="project-symbol symbol-${p.color}"><i class="fa-solid ${p.icon}"></i></span><div><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.category)}</p></div></div><span class="status-pill ${statusClass(p.status)}">${statusLabel(p.status)}</span></div><p class="project-card-description">${escapeHTML(p.description)}</p><div class="project-card-progress"><div class="progress-label"><span>Overall progress</span><strong>${p.progress}%</strong></div><div class="progress-track"><span style="width:${p.progress}%"></span></div></div><div class="project-meta"><span class="project-meta-item"><i class="fa-regular fa-calendar"></i> Due ${prettyDate(p.due)}</span><div class="team-stack"><span>AM</span><span>JD</span><span>+2</span></div></div><div class="project-card-footer"><small>Updated ${prettyDate(p.updated)}</small><button class="project-open" data-action="open-project" data-id="${p.id}">View details <i class="fa-solid fa-arrow-right"></i></button></div></article>`).join("");
    if(!list.length) $("#projectGrid").innerHTML='<div class="panel empty-state"><i class="fa-solid fa-layer-group"></i><h3>No matching projects</h3><p>Try a different filter or search term.</p></div>';
  }
  function fileIcon(type) { return type==="image"?"fa-image":type==="spreadsheet"?"fa-file-excel":type==="doc"?"fa-file-word":type==="archive"?"fa-file-zipper":"fa-file-pdf"; }
  function renderDocuments() {
    const q=($("#documentSearch").value||"").toLowerCase().trim();
    const list=state.documents.filter(d=>(docFilter==="all"||d.type===docFilter)&&(!q||`${d.name} ${projectName(d.projectId)} ${d.by}`.toLowerCase().includes(q)));
    $("#docTotalLabel").textContent=`${state.documents.length} file${state.documents.length===1?"":"s"}`;
    $("#documentTable").innerHTML=list.map(d=>`<tr><td><div class="file-name-cell"><span class="file-icon ${d.type}"><i class="fa-solid ${fileIcon(d.type)}"></i></span><span><strong>${escapeHTML(d.name)}</strong><small>${escapeHTML(d.type.toUpperCase())} file</small></span></div></td><td>${escapeHTML(projectName(d.projectId))}</td><td>${escapeHTML(d.by)}</td><td>${prettyDate(d.date)}</td><td>${escapeHTML(d.size)}</td><td><button class="table-action" data-action="download-document" data-id="${d.id}" aria-label="Download ${escapeHTML(d.name)}"><i class="fa-solid fa-download"></i></button><button class="table-action" data-action="document-options" data-id="${d.id}" aria-label="Document options"><i class="fa-solid fa-ellipsis"></i></button></td></tr>`).join("");
    $("#documentsEmpty").classList.toggle("hidden",!!list.length);
  }
  function renderTickets() {
    const filter=$("#ticketFilter").value;
    const list=state.tickets.filter(t=>filter==="all"||t.status===filter);
    $("#ticketTable").innerHTML=list.map(t=>`<tr><td><strong>#TKT-${t.id}</strong></td><td><span style="color:#344a66;font-weight:700">${escapeHTML(t.subject)}</span><small style="display:block;color:#9aa8b8;margin-top:3px;max-width:250px;overflow:hidden;text-overflow:ellipsis">${escapeHTML(t.description)}</small></td><td><span class="priority-pill priority-${t.priority}"><i class="fa-solid fa-flag"></i> ${t.priority[0].toUpperCase()+t.priority.slice(1)}</span></td><td><span class="status-pill ${statusClass(t.status)}">${statusLabel(t.status)}</span></td><td>${prettyDate(t.created)}</td><td><button class="table-action" data-action="ticket-detail" data-id="${t.id}" aria-label="View ticket"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td></tr>`).join("");
    $("#ticketsEmpty").classList.toggle("hidden",!!list.length);
  }
  function renderInvoices() {
    const filter=$("#invoiceFilter").value;
    const list=state.invoices.filter(i=>filter==="all"||i.status===filter);
    $("#invoiceTable").innerHTML=list.map(i=>`<tr><td><strong style="color:#344a66">${escapeHTML(i.id)}</strong></td><td>${escapeHTML(i.description)}</td><td>${prettyDate(i.issued)}</td><td>${prettyDate(i.due)}</td><td><strong style="color:#344a66">${money(i.amount)}</strong></td><td><span class="status-pill ${statusClass(i.status)}">${statusLabel(i.status)}</span></td><td><button class="table-action" data-action="invoice-detail" data-id="${escapeHTML(i.id)}" aria-label="View invoice"><i class="fa-regular fa-eye"></i></button><button class="table-action" data-action="download-invoice" data-id="${escapeHTML(i.id)}" aria-label="Download invoice"><i class="fa-solid fa-download"></i></button></td></tr>`).join("");
    $("#invoicesEmpty").classList.toggle("hidden",!!list.length);
    const billed=state.invoices.reduce((s,i)=>s+i.amount,0), paid=state.invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0), due=state.invoices.filter(i=>i.status!=="paid").reduce((s,i)=>s+i.amount,0);
    $("#totalBilled").textContent=money(billed);$("#paidTotal").textContent=money(paid);$("#outstandingTotal").textContent=money(due);
  }
  function renderMessages() {
    const q=($("#conversationSearch").value||"").toLowerCase();
    $("#conversationItems").innerHTML=`<div class="conversation-item active" data-conversation="alex"><span class="conversation-avatar">AM</span><span class="conversation-item-copy"><strong>Alex Morgan</strong><small>${escapeHTML(state.messages[state.messages.length-1]?.text||"Start a conversation")}</small></span><span class="conversation-time">Now</span></div>${q&&!("alex morgan".includes(q))?"":""}`;
    $("#messageThread").innerHTML=`<div class="message-date">Today</div>`+state.messages.map(m=>`<div class="message-bubble ${m.mine?"mine":""}"><div class="bubble-copy">${escapeHTML(m.text)}</div><span class="bubble-meta">${m.mine?"You":escapeHTML(m.sender)} · ${escapeHTML(m.time)}</span></div>`).join("");
    $("#messageThread").scrollTop=$("#messageThread").scrollHeight;
  }
  function renderProfile() { renderIdentity(); }
  function renderAdmin() {
    const metrics=[["Clients",state.clients.length,"fa-users"],["Projects",state.projects.length,"fa-layer-group"],["Open tickets",state.tickets.filter(t=>t.status!=="resolved").length,"fa-headset"],["Invoices",state.invoices.length,"fa-file-invoice-dollar"]];
    $("#adminMetrics").innerHTML=metrics.map(m=>`<div class="admin-metric"><span><i class="fa-solid ${m[2]}"></i> ${m[0]}</span><strong>${m[1]}</strong></div>`).join("");
    const configs={
      clients:{title:"Client directory",subtitle:"Client accounts in your workspace.",add:"Add client",head:["CLIENT","COMPANY","EMAIL","PHONE","STATUS"],rows:state.clients.map(c=>`<tr><td><strong style="color:#344a66">${escapeHTML(c.name)}</strong></td><td>${escapeHTML(c.company)}</td><td>${escapeHTML(c.email)}</td><td>${escapeHTML(c.phone)}</td><td><span class="status-pill ${c.status==="Active"?"pill-paid":"pill-pending"}">${c.status}</span></td></tr>`)},
      projects:{title:"Project management",subtitle:"Review progress and update project statuses.",add:"Add project",head:["PROJECT","STATUS","PROGRESS","DUE DATE","ACTION"],rows:state.projects.map(p=>`<tr><td><strong style="color:#344a66">${escapeHTML(p.name)}</strong><small style="display:block;color:#9aa8b8">${escapeHTML(p.category)}</small></td><td><span class="status-pill ${statusClass(p.status)}">${statusLabel(p.status)}</span></td><td>${p.progress}%</td><td>${prettyDate(p.due)}</td><td><button class="table-action" data-action="admin-project-status" data-id="${p.id}" aria-label="Change project status"><i class="fa-solid fa-rotate"></i></button></td></tr>`)},
      tickets:{title:"Support ticket queue",subtitle:"Triage client requests and update status.",add:"",head:["TICKET","CLIENT","PRIORITY","STATUS","ACTION"],rows:state.tickets.map(t=>`<tr><td><strong style="color:#344a66">#TKT-${t.id}</strong><small style="display:block;color:#9aa8b8">${escapeHTML(t.subject)}</small></td><td>Jordan Davis</td><td>${t.priority}</td><td><span class="status-pill ${statusClass(t.status)}">${statusLabel(t.status)}</span></td><td><button class="table-action" data-action="admin-ticket-status" data-id="${t.id}" aria-label="Update ticket status"><i class="fa-solid fa-rotate"></i></button></td></tr>`)}
    };
    const c=configs[adminTab];$("#adminTableTitle").textContent=c.title;$("#adminTableSubtitle").textContent=c.subtitle;$("#adminAddButton").classList.toggle("hidden",!c.add);$("#adminAddButton").innerHTML=`<i class="fa-solid fa-plus"></i> ${c.add}`;
    $("#adminTableHead").innerHTML=`<tr>${c.head.map(h=>`<th>${h}</th>`).join("")}</tr>`;$("#adminTableBody").innerHTML=c.rows.join("");
    $("#adminActivity").innerHTML=state.activities.slice(0,4).map(a=>`<div class="activity-item"><span class="activity-icon ${a.tone}"><i class="fa-solid ${a.icon}"></i></span><div class="activity-copy">${a.text}<small>${escapeHTML(a.time)}</small></div></div>`).join("");
  }
  function renderPage(page=activePage) {
    renderIdentity();
    if(page==="dashboard") renderDashboard();
    if(page==="projects") renderProjects();
    if(page==="documents") renderDocuments();
    if(page==="support") renderTickets();
    if(page==="invoices") renderInvoices();
    if(page==="messages") renderMessages();
    if(page==="profile") renderProfile();
    if(page==="admin") renderAdmin();
  }
  function openModal(title,html,afterOpen) {
    $("#modalTitle").textContent=title;$("#modalBody").innerHTML=html;$("#modalBackdrop").classList.add("open");$("#modalBackdrop").setAttribute("aria-hidden","false");
    if(afterOpen) afterOpen();
    setTimeout(()=>$("#modalBody input, #modalBody select, #modalBody textarea")?.focus(),50);
  }
  function closeModal(){ $("#modalBackdrop").classList.remove("open");$("#modalBackdrop").setAttribute("aria-hidden","true"); }
  const modalActions = `<div class="modal-form-actions"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit"><i class="fa-solid fa-check"></i> Save</button></div>`;
  function newTicketModal() {
    openModal("Create support ticket",`<form id="ticketCreateForm" class="modal-form"><p class="modal-description">Tell us what you need help with. Your account team will follow up in this workspace.</p><label class="form-field"><span>Subject</span><input name="subject" required maxlength="100" placeholder="e.g. Question about a project"></label><label class="form-field"><span>What can we help with?</span><textarea name="description" required maxlength="700" placeholder="Add a few details..."></textarea></label><label class="form-field"><span>Priority</span><select name="priority"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></label>${modalActions}</form>`);
  }
  function projectModal(p) {
    if(!p)return;
    openModal(p.name,`<div class="modal-body"><p class="modal-description">${escapeHTML(p.description)}</p><div class="detail-list"><div class="detail-row"><span>Status</span><strong><span class="status-pill ${statusClass(p.status)}">${statusLabel(p.status)}</span></strong></div><div class="detail-row"><span>Category</span><strong>${escapeHTML(p.category)}</strong></div><div class="detail-row"><span>Progress</span><strong>${p.progress}%</strong></div><div class="progress-track"><span style="width:${p.progress}%"></span></div><div class="detail-row"><span>Start date</span><strong>${prettyDate(p.start)}</strong></div><div class="detail-row"><span>Due date</span><strong>${prettyDate(p.due)}</strong></div><div class="detail-row"><span>Last updated</span><strong>${prettyDate(p.updated)}</strong></div></div><h3 style="font:800 12px Manrope;margin:18px 0 8px">Milestones</h3><div class="detail-list">${(p.milestones||[]).map((m,i)=>`<div class="detail-row"><span><i class="fa-regular ${i===0?"fa-circle-check":"fa-circle"}"></i> ${escapeHTML(m)}</span><strong>${i===0&&p.progress>40?"Done":i===1&&p.status==="review"?"In review":"Upcoming"}</strong></div>`).join("")}</div><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Close</button>${state.role==="admin"?`<button class="btn btn-primary" data-action="admin-project-status" data-id="${p.id}">Change status</button>`:""}</div></div>`);
  }
  function ticketDetail(id) {
    const t=state.tickets.find(x=>x.id===Number(id));if(!t)return;
    openModal(`Ticket #TKT-${t.id}`,`<div class="modal-body"><p class="modal-description">${escapeHTML(t.description)}</p><div class="detail-list"><div class="detail-row"><span>Subject</span><strong>${escapeHTML(t.subject)}</strong></div><div class="detail-row"><span>Priority</span><strong>${t.priority.toUpperCase()}</strong></div><div class="detail-row"><span>Status</span><strong><span class="status-pill ${statusClass(t.status)}">${statusLabel(t.status)}</span></strong></div><div class="detail-row"><span>Created</span><strong>${prettyDate(t.created)}</strong></div></div><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Close</button>${state.role==="admin"?`<button class="btn btn-primary" data-action="admin-ticket-status" data-id="${t.id}">Update status</button>`:""}</div></div>`);
  }
  function invoiceDetail(id,download=false) {
    const i=state.invoices.find(x=>x.id===id);if(!i)return;
    if(download){const content=`ORBIT PORTAL — INVOICE\n${i.id}\n\nBill to: ${state.user.name}\nCompany: ${state.user.company}\nDescription: ${i.description}\nIssued: ${prettyDate(i.issued)}\nDue: ${prettyDate(i.due)}\nAmount: ${money(i.amount)}\nStatus: ${statusLabel(i.status)}\n\nDEMO ONLY — not a real invoice.`;return downloadBlob(content,`${i.id}.txt`,"text/plain");}
    openModal(i.id,`<div class="modal-body"><p class="modal-description">Invoice summary · Demo billing record</p><div style="background:#f2faff;border:1px solid #e1f1fa;border-radius:10px;padding:18px;margin-bottom:17px"><small style="color:#8096ac">TOTAL AMOUNT</small><div style="font:800 27px Manrope;margin:4px 0 8px">${money(i.amount)}</div><span class="status-pill ${statusClass(i.status)}">${statusLabel(i.status)}</span></div><div class="detail-list"><div class="detail-row"><span>Invoice number</span><strong>${i.id}</strong></div><div class="detail-row"><span>Description</span><strong>${escapeHTML(i.description)}</strong></div><div class="detail-row"><span>Issued date</span><strong>${prettyDate(i.issued)}</strong></div><div class="detail-row"><span>Due date</span><strong>${prettyDate(i.due)}</strong></div><div class="detail-row"><span>Client</span><strong>${escapeHTML(state.user.company)}</strong></div></div><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="download-invoice" data-id="${i.id}"><i class="fa-solid fa-download"></i> Download copy</button></div></div>`);
  }
  function downloadBlob(content,filename,type="application/octet-stream") {
    const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportCSV() {
    const rows=[["Invoice","Description","Issued","Due","Amount USD","Status"],...state.invoices.map(i=>[i.id,i.description,i.issued,i.due,i.amount,i.status])];
    const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    downloadBlob(csv,"orbit-invoice-statement.csv","text/csv;charset=utf-8");toast("Statement exported","Your CSV download is ready.");
  }
  function addProjectModal() {
    openModal("Add project",`<form id="projectCreateForm" class="modal-form"><label class="form-field"><span>Project name</span><input name="name" required maxlength="90"></label><label class="form-field"><span>Category</span><input name="category" required maxlength="60" placeholder="e.g. Digital experience"></label><label class="form-field"><span>Description</span><textarea name="description" required maxlength="500"></textarea></label><label class="form-field"><span>Due date</span><input name="due" type="date" required value="2026-11-15"></label><label class="form-field"><span>Initial progress (%)</span><input name="progress" type="number" min="0" max="99" value="0" required></label>${modalActions}</form>`);
  }
  function addClientModal() {
    openModal("Add client",`<form id="clientCreateForm" class="modal-form"><label class="form-field"><span>Full name</span><input name="name" required maxlength="80"></label><label class="form-field"><span>Email address</span><input name="email" type="email" required maxlength="120"></label><label class="form-field"><span>Company</span><input name="company" required maxlength="100"></label><label class="form-field"><span>Phone number</span><input name="phone" maxlength="30"></label>${modalActions}</form>`);
  }
  function newMessageModal() {
    openModal("New message",`<form id="newMessageForm" class="modal-form"><p class="modal-description">Send a note to your account manager, Alex Morgan.</p><label class="form-field"><span>Message</span><textarea name="message" required maxlength="600" placeholder="Write your message..."></textarea></label>${modalActions}</form>`);
  }
  function handleAction(action, el) {
    const id=el.dataset.id;
    switch(action) {
      case "close-modal": closeModal(); break;
      case "new-ticket": newTicketModal(); break;
      case "open-project": projectModal(projectById(id)); break;
      case "ticket-detail": ticketDetail(id); break;
      case "invoice-detail": invoiceDetail(id); break;
      case "download-invoice": invoiceDetail(id,true); break;
      case "new-message": newMessageModal(); break;
      case "add-project": addProjectModal(); break;
      case "add-client": addClientModal(); break;
      case "show-activity": toast("Recent activity","Activity is shown on the Overview dashboard.");navigate("dashboard");break;
      case "download-document": {
        const d=state.documents.find(x=>x.id===Number(id));if(!d)return;
        if(uploadedFiles[d.id]) {const a=document.createElement("a");a.href=uploadedFiles[d.id];a.download=d.name;a.click();}
        else {downloadBlob(`ORBIT PORTAL — DEMO DOCUMENT\n\n${d.name}\nProject: ${projectName(d.projectId)}\nShared by: ${d.by}\nDate: ${d.date}\n\nThis is a placeholder download. Original sample file content is not bundled.`,d.name.replace(/\.[^.]+$/,"")+"_demo.txt","text/plain");}
        toast("Download prepared",d.name);break;
      }
      case "document-options": {
        const d=state.documents.find(x=>x.id===Number(id));if(d)openModal("Document details",`<div class="modal-body"><div class="detail-list"><div class="detail-row"><span>Name</span><strong>${escapeHTML(d.name)}</strong></div><div class="detail-row"><span>Project</span><strong>${escapeHTML(projectName(d.projectId))}</strong></div><div class="detail-row"><span>Shared by</span><strong>${escapeHTML(d.by)}</strong></div><div class="detail-row"><span>Added</span><strong>${prettyDate(d.date)}</strong></div><div class="detail-row"><span>Size</span><strong>${escapeHTML(d.size)}</strong></div></div><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="download-document" data-id="${d.id}">Download</button></div></div>`);break;
      }
      case "admin-project-status": {
        const p=projectById(id);if(!p)return;const order=["in-progress","review","completed"];p.status=order[(order.indexOf(p.status)+1)%order.length];p.progress=p.status==="completed"?100:p.status==="review"?Math.max(p.progress,85):Math.min(p.progress,75);p.updated=new Date().toISOString().slice(0,10);addActivity("fa-rotate","purple",`Admin updated <strong>${escapeHTML(p.name)}</strong> status.`);save();closeModal();renderPage();toast("Project updated",`${p.name} is now ${statusLabel(p.status)}.`);break;
      }
      case "admin-ticket-status": {
        const t=state.tickets.find(x=>x.id===Number(id));if(!t)return;const order=["open","in-progress","resolved"];t.status=order[(order.indexOf(t.status)+1)%order.length];addActivity("fa-headset","blue",`Support ticket <strong>#TKT-${t.id}</strong> was updated.`);save();closeModal();renderPage();toast("Ticket updated",`Status: ${statusLabel(t.status)}.`);break;
      }
      case "export-data": downloadBlob(JSON.stringify(state,null,2),"orbit-workspace-backup.json","application/json");toast("Workspace exported","JSON backup downloaded.");break;
      case "reset-data": openModal("Reset demo workspace",`<div class="modal-body"><p class="modal-description">This restores the original sample data and clears local changes. This action cannot be undone.</p><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="confirm-reset">Reset workspace</button></div></div>`);break;
      case "confirm-reset": localStorage.removeItem(STORE_KEY);state=clone(window.OrbitSeed);state.role="client";uploadedFiles={};save();closeModal();renderIdentity();navigate("dashboard");toast("Workspace reset","Sample data has been restored.");break;
    }
  }
  document.addEventListener("click",e=>{
    const pageLink=e.target.closest("[data-page-link]");if(pageLink){navigate(pageLink.dataset.pageLink);return;}
    const nav=e.target.closest("[data-page]");if(nav){e.preventDefault();navigate(nav.dataset.page);return;}
    const action=e.target.closest("[data-action]");if(action){e.preventDefault();handleAction(action.dataset.action,action);return;}
  });
  $("#modalClose").addEventListener("click",closeModal);
  $("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#globalSearch").focus();}});
  $("#mobileMenu").addEventListener("click",()=>{$("#sidebar").classList.toggle("open");$("#overlay").classList.toggle("show");});
  $("#overlay").addEventListener("click",()=>{$("#sidebar").classList.remove("open");$("#overlay").classList.remove("show");});
  $("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");const dark=document.body.classList.contains("dark-mode");$("#themeToggle").innerHTML=`<i class="fa-regular ${dark?"fa-sun":"fa-moon"}"></i>`;try{localStorage.setItem("orbitTheme",dark?"dark":"light")}catch{}});
  try{if(localStorage.getItem("orbitTheme")==="dark"){document.body.classList.add("dark-mode");$("#themeToggle").innerHTML='<i class="fa-regular fa-sun"></i>'}}catch{}
  $("#userMenuButton").addEventListener("click",()=>openModal("Account menu",`<div class="modal-body"><p class="modal-description">Switch between the two demo views. This does not create real user accounts or secure data.</p><div class="detail-list"><div class="detail-row"><span>Signed in as</span><strong>${escapeHTML(state.user.name)}</strong></div><div class="detail-row"><span>Current view</span><strong>${state.role==="admin"?"Admin":"Client"}</strong></div></div><div class="modal-form-actions" style="justify-content:stretch"><button class="btn btn-outline" data-action="switch-role" data-role="client" style="flex:1"><i class="fa-regular fa-user"></i> Client view</button><button class="btn btn-primary" data-action="switch-role" data-role="admin" style="flex:1"><i class="fa-solid fa-sliders"></i> Admin view</button></div><div class="modal-form-actions"><button class="btn btn-outline" data-action="close-modal">Close</button><button class="btn btn-outline" data-action="go-profile">Edit profile</button></div></div>`));
  document.addEventListener("click",e=>{
    const el=e.target.closest('[data-action="switch-role"]');if(el){state.role=el.dataset.role;save();closeModal();renderIdentity();if(state.role==="admin"){navigate("admin");toast("Admin demo enabled","You are viewing the simulated admin console.");}else{navigate("dashboard");toast("Client view enabled","Welcome back to your client workspace.");}}
    const prof=e.target.closest('[data-action="go-profile"]');if(prof){closeModal();navigate("profile");}
  });
  $("#projectFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;projectFilter=b.dataset.filter;$$("[data-filter]",$("#projectFilters")).forEach(x=>x.classList.toggle("active",x===b));renderProjects();});
  $("#projectSort").addEventListener("change",renderProjects);
  $("#globalSearch").addEventListener("input",()=>{if(activePage==="projects")renderProjects();if(activePage==="documents")renderDocuments();});
  $("#documentFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;docFilter=b.dataset.filter;$$("[data-filter]",$("#documentFilters")).forEach(x=>x.classList.toggle("active",x===b));renderDocuments();});
  $("#documentSearch").addEventListener("input",renderDocuments);
  $("#ticketFilter").addEventListener("change",renderTickets);
  $("#invoiceFilter").addEventListener("change",renderInvoices);
  $("#downloadStatement").addEventListener("click",exportCSV);
  $("#documentUpload").addEventListener("change",e=>{
    [...e.target.files].forEach(file=>{
      const id=Date.now()+Math.floor(Math.random()*9999),ext=file.name.split(".").pop().toLowerCase();
      const type=["png","jpg","jpeg","gif","webp","svg"].includes(ext)?"image":["xls","xlsx","csv"].includes(ext)?"spreadsheet":["doc","docx"].includes(ext)?"doc":["zip","rar"].includes(ext)?"archive":"pdf";
      state.documents.unshift({id,name:file.name,type,projectId:state.projects[0]?.id||101,by:state.user.name,date:new Date().toISOString().slice(0,10),size:file.size>1048576?(file.size/1048576).toFixed(1)+" MB":Math.max(1,Math.round(file.size/1024))+" KB"});
      uploadedFiles[id]=URL.createObjectURL(file);
    });
    save();renderDocuments();renderDashboard();toast("Upload added","File metadata is saved in this browser only.");e.target.value="";
  });
  $("#messageForm").addEventListener("submit",e=>{e.preventDefault();const input=$("#messageInput"),text=input.value.trim();if(!text)return;state.messages.push({id:Date.now(),sender:state.user.name,mine:true,text,time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})});save();input.value="";renderMessages();toast("Message sent","Your demo message was added to the thread.");});
  $("#messageAttach").addEventListener("click",()=>toast("Attachments unavailable","This demo messaging interface supports text only."));
  $("#profileForm").addEventListener("submit",e=>{e.preventDefault();saveProfile();});
  $("#saveProfile").addEventListener("click",saveProfile);
  function saveProfile(){const name=$("#profileName").value.trim(),email=$("#profileEmail").value.trim(),company=$("#profileCompany").value.trim();if(!name||!email||!company){toast("Check required fields","Name, email, and company are required.",true);return;}Object.assign(state.user,{name,email,company,phone:$("#profilePhone").value.trim(),job:$("#profileJob").value.trim(),timezone:$("#profileTimezone").value,emailUpdates:$("#emailUpdates").checked});save();renderIdentity();addActivity("fa-user-pen","blue","<strong>Profile details</strong> were updated.");renderIdentity();toast("Profile saved","Your demo profile has been updated.");}
  $("#modalBody").addEventListener("submit",e=>{
    e.preventDefault();const f=e.target,fd=new FormData(f);
    if(f.id==="ticketCreateForm"){const t={id:Math.max(300,...state.tickets.map(x=>x.id))+1,subject:fd.get("subject").trim(),description:fd.get("description").trim(),priority:fd.get("priority"),status:"open",created:new Date().toISOString().slice(0,10),clientId:1};state.tickets.unshift(t);addActivity("fa-circle-question","orange",`New support ticket <strong>#TKT-${t.id}</strong> created.`);save();closeModal();navigate("support");toast("Ticket created",`Ticket #TKT-${t.id} is now open.`);}
    if(f.id==="projectCreateForm"){const name=fd.get("name").trim(),p={id:Math.max(100,...state.projects.map(x=>x.id))+1,name,category:fd.get("category").trim(),description:fd.get("description").trim(),due:fd.get("due"),start:new Date().toISOString().slice(0,10),updated:new Date().toISOString().slice(0,10),progress:Number(fd.get("progress")),status:"in-progress",icon:"fa-layer-group",color:"blue",milestones:["Kickoff","Progress review","Final delivery"]};state.projects.unshift(p);addActivity("fa-layer-group","blue",`New project <strong>${escapeHTML(name)}</strong> was added.`);save();closeModal();navigate("projects");toast("Project added",name);}
    if(f.id==="clientCreateForm"){const c={id:Math.max(0,...state.clients.map(x=>x.id))+1,name:fd.get("name").trim(),email:fd.get("email").trim(),company:fd.get("company").trim(),phone:fd.get("phone").trim(),status:"Active"};state.clients.push(c);addActivity("fa-user-plus","green",`Client <strong>${escapeHTML(c.name)}</strong> was added.`);save();closeModal();renderAdmin();toast("Client added",c.name);}
    if(f.id==="newMessageForm"){state.messages.push({id:Date.now(),sender:state.user.name,mine:true,text:fd.get("message").trim(),time:new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})});save();closeModal();navigate("messages");renderMessages();toast("Message sent","Your note was added to the local conversation.");}
  });
  $("#adminAddButton").addEventListener("click",()=>adminTab==="clients"?addClientModal():adminTab==="projects"?addProjectModal():toast("Ticket queue","Create new tickets from the Support center."));
  $$(".admin-tab").forEach(b=>b.addEventListener("click",()=>{adminTab=b.dataset.adminTab;$$(".admin-tab").forEach(x=>x.classList.toggle("active",x===b));renderAdmin();}));
  $("#notificationButton").addEventListener("click",()=>openModal("Notifications",`<div class="modal-body"><p class="modal-description">Your latest workspace notifications.</p>${state.activities.slice(0,4).map(a=>`<div class="activity-item"><span class="activity-icon ${a.tone}"><i class="fa-solid ${a.icon}"></i></span><div class="activity-copy">${a.text}<small>${escapeHTML(a.time)}</small></div></div>`).join("")}<div class="modal-form-actions"><button class="btn btn-primary" data-action="close-modal">Done</button></div></div>`));
  // Set route on first load; hash changes are supported for direct navigation.
  window.addEventListener("hashchange",()=>{const page=location.hash.replace("#","");if(page&&$("#page-"+page)&&page!==activePage)navigate(page);});
  renderIdentity();renderDashboard();renderProjects();renderDocuments();renderTickets();renderInvoices();renderMessages();
  const initial=location.hash.replace("#","");if(initial&&$("#page-"+initial))navigate(initial);else navigate("dashboard");
})();