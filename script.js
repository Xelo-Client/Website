// Simple script to trigger fade-in animations on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
    el.style.animationPlayState = 'running';
  });
});
