function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('[data-toggle="password"]');
  
    toggleButtons.forEach(button => {
      const inputId = button.getAttribute('data-target');
      const passwordInput = document.getElementById(inputId);
  
      if (!passwordInput) return;
  
      button.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? '🙈' : '👁️';
      });
    });
  }
  
document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
});