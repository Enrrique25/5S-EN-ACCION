const stages = [
  {name:"Seiri",title:"Clasificar",symbol:"📦",caption:"SEPARAR",text:"Separar lo necesario de lo innecesario. Identificar materiales obsoletos, dañados o sin uso y gestionarlos mediante el procedimiento autorizado.",items:["Retirar obstáculos y materiales sin uso.","Identificar productos dañados o vencidos.","No desechar materiales sin autorización."]},
  {name:"Seiton",title:"Ordenar",symbol:"🗂️",caption:"CADA COSA EN SU LUGAR",text:"Asignar un lugar definido para cada elemento y facilitar su identificación y acceso seguro.",items:["Rotular estanterías y ubicaciones.","Mantener pasillos y salidas despejados.","Respetar la capacidad de carga y el apilamiento seguro."]},
  {name:"Seiso",title:"Limpiar",symbol:"🧹",caption:"LIMPIAR E INSPECCIONAR",text:"Mantener limpias las áreas y equipos, detectando durante la limpieza derrames, fugas, daños y otras anomalías.",items:["Retirar residuos según el procedimiento.","Señalizar y gestionar derrames de forma segura.","Reportar daños y condiciones anormales."]},
  {name:"Seiketsu",title:"Estandarizar",symbol:"📋",caption:"MANTENER EL ESTÁNDAR",text:"Definir reglas visuales y rutinas para sostener la clasificación, el orden y la limpieza.",items:["Usar listas de verificación.","Mantener señalización visible y legible.","Definir responsables y frecuencias."]},
  {name:"Shitsuke",title:"Disciplinar",symbol:"⭐",caption:"HACERLO UN HÁBITO",text:"Crear hábitos mediante capacitación, participación, seguimiento y mejora continua.",items:["Cumplir los estándares establecidos.","Participar en inspecciones y capacitaciones.","Dar seguimiento a los hallazgos y acciones correctivas."]}
];
document.querySelectorAll(".s-card").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".s-card").forEach(b=>b.classList.remove("active","clicked"));btn.classList.add("active");
  // Reinicia y reproduce el efecto de pulsación en la tarjeta seleccionada.
  void btn.offsetWidth;
  btn.classList.add("clicked");
  btn.addEventListener("animationend",()=>btn.classList.remove("clicked"),{once:true});
  const s=stages[Number(btn.dataset.s)];
  const detail=document.getElementById("sDetail");
  detail.innerHTML=`<div class="detail-visual" aria-hidden="true"><span class="animated-symbol">${s.symbol}</span><span class="visual-caption">${s.caption}</span></div><div class="detail-copy"><div class="detail-number">${String(Number(btn.dataset.s)+1).padStart(2,"0")}</div><p class="eyebrow dark">${s.name.toUpperCase()}</p><h3>${s.title}</h3><p>${s.text}</p><ul>${s.items.map(x=>`<li>${x}</li>`).join("")}</ul></div>`;
  detail.classList.remove("is-changing");
  void detail.offsetWidth;
  detail.classList.add("is-changing");
}));
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));

const criteria=[
 ["Seiri","Los materiales innecesarios están identificados y gestionados."],
 ["Seiri","Los materiales dañados están segregados e identificados."],
 ["Seiton","Los productos tienen ubicaciones definidas y rotuladas."],
 ["Seiton","Los pasillos y rutas de evacuación están despejados."],
 ["Seiton","Las cargas están estables y respetan los límites señalizados."],
 ["Seiso","Los pisos están limpios y sin derrames no controlados."],
 ["Seiso","Los residuos se depositan en los recipientes asignados."],
 ["Seiketsu","Hay estándares y listas de verificación disponibles."],
 ["Seiketsu","La señalización es visible y está en buen estado."],
 ["Shitsuke","El personal conoce las reglas de trabajo establecidas."],
 ["Shitsuke","Se revisan y atienden los hallazgos anteriores."]
];
const auditList=document.getElementById("auditList");
criteria.forEach((c,i)=>{const label=document.createElement("label");label.className="audit-item";label.innerHTML=`<input type="checkbox" class="audit-check"><span><b>${c[0]}:</b> ${c[1]}</span>`;auditList.appendChild(label)});
function updateScore(){const boxes=[...document.querySelectorAll(".audit-check")];const n=boxes.filter(x=>x.checked).length;const pct=Math.round(n/boxes.length*100);document.getElementById("score").textContent=pct+"%";document.getElementById("progressBar").style.width=pct+"%"}
document.querySelectorAll(".audit-check").forEach(x=>x.addEventListener("change",updateScore));
function getAudits(){try{return JSON.parse(localStorage.getItem("5s-audits")||"[]")}catch(e){return []}}
function showHistory(){const h=getAudits();document.getElementById("auditHistory").innerHTML=h.length?"<b>Registros guardados en este navegador:</b><br>"+h.slice(0,5).map(x=>`${x.date} · ${escapeHtml(x.zone)} · ${x.score}%`).join("<br>"):"Todavía no hay auditorías guardadas."}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.getElementById("saveAudit").addEventListener("click",()=>{const boxes=[...document.querySelectorAll(".audit-check")];const n=boxes.filter(x=>x.checked).length;const entry={date:new Date().toLocaleString("es-PE"),zone:document.getElementById("zona").value||"Zona no indicada",owner:document.getElementById("responsable").value||"No indicado",score:Math.round(n/boxes.length*100),checked:n,total:boxes.length};const h=getAudits();h.unshift(entry);localStorage.setItem("5s-audits",JSON.stringify(h));document.getElementById("auditMessage").textContent="Registro guardado en este navegador. Para compartirlo con el profesor, necesitarás conectar una base de datos o exportarlo.";showHistory()});
showHistory();

document.getElementById("makeReport").addEventListener("click",()=>{const text=`REPORTE DE CONDICIÓN INSEGURA – PROGRAMA 5S
Fecha: ${new Date().toLocaleString("es-PE")}
Condición: ${document.getElementById("hazardType").value}
Ubicación: ${document.getElementById("hazardLocation").value||"No indicada"}
Prioridad: ${document.getElementById("hazardPriority").value}
Descripción: ${document.getElementById("hazardDescription").value||"Sin descripción"}`;
document.getElementById("reportOutput").value=text});
document.getElementById("copyReport").addEventListener("click",async()=>{const out=document.getElementById("reportOutput");if(!out.value){out.focus();return}try{await navigator.clipboard.writeText(out.value);document.getElementById("copyReport").textContent="¡Copiado!"}catch(e){out.select();document.execCommand("copy");document.getElementById("copyReport").textContent="¡Copiado!"}});

const questions=[
 {q:"¿Cuál es el objetivo principal de la metodología 5S?",a:["Aumentar las horas de trabajo","Mantener el almacén organizado y mejorar las condiciones de trabajo","Reducir el personal","Almacenar más productos sin control"],correct:1,why:"Las 5S promueven clasificación, orden, limpieza, estandarización y disciplina."},
 {q:"¿Qué significa Seiri?",a:["Separar lo necesario de lo innecesario","Limpiar todos los equipos","Pintar los pasillos","Contar el inventario"],correct:0,why:"Seiri es clasificar y retirar lo innecesario mediante el procedimiento autorizado."},
 {q:"¿Qué puede ocurrir si se dejan cajas o pallets en los pasillos?",a:["Mejora el tránsito","No genera ningún riesgo","Puede causar tropiezos y bloquear rutas de evacuación","Aumenta la visibilidad"],correct:2,why:"Los obstáculos pueden provocar caídas y dificultar la evacuación."},
 {q:"¿Qué debes hacer si encuentras un extintor bloqueado?",a:["Ignorarlo","Informar y gestionar la liberación inmediata del acceso de forma segura","Esperar a la auditoría mensual","Colocar más cajas al lado"],correct:1,why:"Los equipos de emergencia deben permanecer accesibles en todo momento."},
 {q:"¿Para qué sirve una auditoría 5S?",a:["Evaluar el cumplimiento y detectar oportunidades de mejora","Contar solamente productos","Reemplazar la capacitación","Aumentar el inventario"],correct:0,why:"La auditoría verifica los estándares y ayuda a priorizar acciones correctivas."}
];
let qIndex=0,score=0,answered=false;
function renderQuestion(){const q=questions[qIndex];answered=false;document.getElementById("questionCount").textContent=`Pregunta ${qIndex+1} de ${questions.length}`;document.getElementById("quizScore").textContent=`Aciertos: ${score}`;document.getElementById("questionText").textContent=q.q;document.getElementById("answerFeedback").textContent="";document.getElementById("nextQuestion").disabled=true;document.getElementById("nextQuestion").textContent=qIndex===questions.length-1?"Ver resultado":"Siguiente";const box=document.getElementById("answerOptions");box.innerHTML="";q.a.forEach((a,i)=>{const b=document.createElement("button");b.className="answer";b.textContent=a;b.addEventListener("click",()=>chooseAnswer(i));box.appendChild(b)})}
function chooseAnswer(i){if(answered)return;answered=true;const q=questions[qIndex];const buttons=[...document.querySelectorAll(".answer")];buttons.forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add("correct");else if(j===i)b.classList.add("wrong")});if(i===q.correct)score++;document.getElementById("quizScore").textContent=`Aciertos: ${score}`;document.getElementById("answerFeedback").textContent=(i===q.correct?"¡Correcto! ":"No es correcto. ")+q.why;document.getElementById("nextQuestion").disabled=false}
document.getElementById("nextQuestion").addEventListener("click",()=>{if(!answered)return;if(qIndex<questions.length-1){qIndex++;renderQuestion()}else{document.getElementById("questionCount").textContent="Evaluación finalizada";document.getElementById("questionText").textContent=`Obtuviste ${score} de ${questions.length} respuestas correctas.`;document.getElementById("answerOptions").innerHTML="<button class='button' id='retryQuiz'>Volver a intentar</button>";document.getElementById("answerFeedback").textContent=score>=4?"¡Muy bien! Tienes buenos conocimientos básicos de 5S.":"Repasa las etapas 5S y vuelve a intentarlo.";document.getElementById("nextQuestion").style.display="none";document.getElementById("retryQuiz").addEventListener("click",()=>{qIndex=0;score=0;document.getElementById("nextQuestion").style.display="inline-block";renderQuestion()})}});
renderQuestion();
