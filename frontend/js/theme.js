
const THEME_KEY = "procurexTheme";
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  const btn=document.querySelector("[data-theme-toggle]");
  if(btn) btn.textContent = theme==="dark" ? "☀" : "☾";
}
function initTheme(){
  const saved=localStorage.getItem(THEME_KEY) || "light";
  applyTheme(saved);
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const next=(localStorage.getItem(THEME_KEY)||"light")==="light"?"dark":"light";
      localStorage.setItem(THEME_KEY,next); applyTheme(next);
    });
  });
}
document.addEventListener("DOMContentLoaded",initTheme);
