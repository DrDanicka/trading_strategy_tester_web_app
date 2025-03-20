document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const icon = document.getElementById('toggle-icon');
  
    // Check localStorage on initial load
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
      icon.src = 'static/images/light-mode.png';
    } else {
      icon.src = 'static/images/dark-mode.png';
    }
  });
  
  function toggleDarkMode() {
    const body = document.body;
    const icon = document.getElementById('toggle-icon');
  
    body.classList.toggle('dark-mode');
  
    if (body.classList.contains('dark-mode')) {
      icon.src = 'static/images/light-mode.png';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      icon.src = 'static/images/dark-mode.png';
      localStorage.setItem('darkMode', 'disabled');
    }
  }
  