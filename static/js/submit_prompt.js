function submitPrompt() {
    const prompt = document.getElementById('prompt').value;
    document.getElementById('loading-spinner').style.display = 'block';
    // Trigger the animation immediately
    document.getElementById('prompt-section').classList.add('top-center');
    document.getElementById('title').classList.add('top-left');
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('prompt');
  
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        submitPrompt();
      }
    });
  });
