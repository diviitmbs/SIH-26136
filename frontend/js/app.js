
function toast(message){
  let t=document.getElementById("toast");
  if(!t){t=document.createElement("div");t.id="toast";Object.assign(t.style,{position:"fixed",right:"20px",bottom:"20px",zIndex:"100",background:"var(--navy)",color:"var(--surface)",padding:"13px 17px",borderRadius:"12px",boxShadow:"var(--shadow)"});document.body.appendChild(t)}
  t.textContent=message;t.style.opacity="1";clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.opacity="0",2200)
}
function go(path){window.location.href=path}
function bindLinks(){
  document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>go(el.dataset.go)));
  document.querySelectorAll("[data-toast]").forEach(el=>el.addEventListener("click",()=>toast(el.dataset.toast)));
}
document.addEventListener("DOMContentLoaded",bindLinks);
