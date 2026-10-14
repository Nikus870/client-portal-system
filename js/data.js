/* Orbit Portal sample data. All data is fictional and for demonstration only. */
window.OrbitSeed = {
  user: { name:"Jordan Davis", email:"jordan.davis@northstar.test", company:"Northstar Studio", phone:"+1 (555) 010-2026", job:"Client administrator", timezone:"Asia/Kolkata (IST)", emailUpdates:true, role:"client" },
  clients: [
    {id:1,name:"Jordan Davis",email:"jordan.davis@northstar.test",company:"Northstar Studio",phone:"+1 (555) 010-2026",status:"Active"},
    {id:2,name:"Maya Chen",email:"maya.chen@pixelcraft.test",company:"Pixelcraft Co.",phone:"+1 (555) 010-2044",status:"Active"},
    {id:3,name:"Oliver Reed",email:"oliver.reed@brightpath.test",company:"Brightpath Labs",phone:"+1 (555) 010-2091",status:"Active"},
    {id:4,name:"Sofia Patel",email:"sofia.patel@evergreen.test",company:"Evergreen Market",phone:"+1 (555) 010-2028",status:"Pending"}
  ],
  projects: [
    {id:101,name:"Website Revamp",category:"Digital experience",status:"in-progress",progress:78,start:"2026-09-01",due:"2026-10-24",updated:"2026-10-12",description:"A refreshed, accessible website experience with a cleaner information architecture and conversion-focused pages.",icon:"fa-display",color:"blue",milestones:["Wireframes approved","Visual design review","Development handoff"]},
    {id:102,name:"Brand Identity Kit",category:"Brand & design",status:"review",progress:92,start:"2026-08-12",due:"2026-10-18",updated:"2026-10-11",description:"A cohesive identity system including logo usage, typography, color palette, and brand guidelines.",icon:"fa-pen-nib",color:"violet",milestones:["Logo concepts","Brand guidelines","Final asset delivery"]},
    {id:103,name:"Customer Insights",category:"Research & analytics",status:"in-progress",progress:46,start:"2026-09-20",due:"2026-11-02",updated:"2026-10-10",description:"Research, interviews, and an actionable insights report to help prioritize the next product improvements.",icon:"fa-chart-line",color:"orange",milestones:["Research plan","Customer interviews","Insights presentation"]},
    {id:104,name:"Q3 Campaign Assets",category:"Marketing",status:"completed",progress:100,start:"2026-07-02",due:"2026-09-29",updated:"2026-10-01",description:"Campaign creative and social assets delivered for the third-quarter product launch.",icon:"fa-bullhorn",color:"green",milestones:["Creative brief","Asset production","Final delivery"]}
  ],
  documents: [
    {id:201,name:"Website_Project_Brief.pdf",type:"pdf",projectId:101,by:"Alex Morgan",date:"2026-10-12",size:"2.4 MB"},
    {id:202,name:"Brand_Guidelines_v3.pdf",type:"pdf",projectId:102,by:"Alex Morgan",date:"2026-10-11",size:"8.1 MB"},
    {id:203,name:"Homepage_Mockup.png",type:"image",projectId:101,by:"Design team",date:"2026-10-10",size:"4.7 MB"},
    {id:204,name:"Customer_Interview_Notes.docx",type:"doc",projectId:103,by:"Research team",date:"2026-10-09",size:"820 KB"},
    {id:205,name:"Q3_Performance.xlsx",type:"spreadsheet",projectId:104,by:"Alex Morgan",date:"2026-10-06",size:"1.2 MB"},
    {id:206,name:"Invoice_OCT_2026.pdf",type:"pdf",projectId:101,by:"Finance team",date:"2026-10-03",size:"186 KB"},
    {id:207,name:"Logo_Explorations.png",type:"image",projectId:102,by:"Design team",date:"2026-10-02",size:"3.1 MB"},
    {id:208,name:"Content_Audit.xlsx",type:"spreadsheet",projectId:101,by:"Research team",date:"2026-09-29",size:"640 KB"},
    {id:209,name:"Campaign_Summary.pdf",type:"pdf",projectId:104,by:"Alex Morgan",date:"2026-09-25",size:"1.8 MB"},
    {id:210,name:"Interview_Summary.docx",type:"doc",projectId:103,by:"Research team",date:"2026-09-22",size:"570 KB"},
    {id:211,name:"Social_Assets.zip",type:"archive",projectId:104,by:"Design team",date:"2026-09-19",size:"12.5 MB"},
    {id:212,name:"Project_Timeline.xlsx",type:"spreadsheet",projectId:101,by:"Alex Morgan",date:"2026-09-15",size:"410 KB"}
  ],
  tickets: [
    {id:301,subject:"Update billing contact details",description:"Please update the billing contact for upcoming invoices.",priority:"medium",status:"open",created:"2026-10-12",clientId:1},
    {id:302,subject:"Homepage image looks compressed",description:"The hero image in the latest preview seems compressed on desktop.",priority:"high",status:"in-progress",created:"2026-10-10",clientId:1},
    {id:303,subject:"Access to campaign assets",description:"Could you share the final campaign asset folder?",priority:"low",status:"resolved",created:"2026-10-05",clientId:1}
  ],
  invoices: [
    {id:"INV-2026-104",description:"Website Revamp — milestone 2",issued:"2026-10-10",due:"2026-10-24",amount:1450,status:"pending"},
    {id:"INV-2026-103",description:"Brand Identity Kit — final review",issued:"2026-10-01",due:"2026-10-15",amount:1000,status:"pending"},
    {id:"INV-2026-102",description:"Customer Insights — discovery",issued:"2026-09-15",due:"2026-09-29",amount:2250,status:"paid"},
    {id:"INV-2026-101",description:"Website Revamp — kickoff",issued:"2026-09-01",due:"2026-09-15",amount:3800,status:"paid"},
    {id:"INV-2026-099",description:"Q3 Campaign Assets",issued:"2026-08-01",due:"2026-08-15",amount:4250,status:"paid"},
    {id:"INV-2026-096",description:"Brand Identity Kit — deposit",issued:"2026-07-10",due:"2026-07-24",amount:6000,status:"paid"}
  ],
  activities: [
    {icon:"fa-file-lines",tone:"blue",text:"<strong>Alex Morgan</strong> shared a new project brief.",time:"2 hours ago"},
    {icon:"fa-check",tone:"green",text:"<strong>Brand Identity Kit</strong> moved to review.",time:"Yesterday, 4:32 PM"},
    {icon:"fa-comment-dots",tone:"purple",text:"<strong>Design team</strong> replied to your feedback.",time:"Yesterday, 11:08 AM"},
    {icon:"fa-credit-card",tone:"orange",text:"Invoice <strong>INV-2026-102</strong> was marked paid.",time:"Oct 9, 2026"}
  ],
  messages: [
    {id:1,sender:"Alex Morgan",mine:false,text:"Hi Jordan! The latest website designs are ready for your review. I've shared the updated brief in Documents.",time:"10:32 AM"},
    {id:2,sender:"Jordan Davis",mine:true,text:"Thanks, Alex. I'll review them this afternoon. The new direction is looking great.",time:"10:41 AM"},
    {id:3,sender:"Alex Morgan",mine:false,text:"Perfect. I've also added the next milestone dates to the project timeline. Let me know if you want to walk through anything together.",time:"10:44 AM"}
  ]
};
