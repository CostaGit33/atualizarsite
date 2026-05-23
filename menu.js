/* ============================
   Mobile Menu Toggle
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const appNav = document.querySelector(".app-nav");
  
  if (menuToggle && appNav) {
    // Toggle menu ao clicar no botão
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      appNav.classList.toggle("active");
    });

    // Fechar menu ao clicar em um link
    const navLinks = appNav.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        appNav.classList.remove("active");
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!appNav.contains(e.target) && !menuToggle.contains(e.target)) {
        appNav.classList.remove("active");
      }
    });
  }
});
