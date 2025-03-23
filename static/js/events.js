window.addEventListener('resize', () => {
  const graphs = document.querySelectorAll('.graph-wrapper');
  graphs.forEach(g => Plotly.Plots.resize(g));
});

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('prompt');

    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        window.submitPrompt();
      }
    });
  });


// Drag bar for resizing graph and results panes
let isDragging = false;
const dragBar = document.getElementById('drag-bar');
const graphPane = document.getElementById('graph-pane');
const resultsPane = document.getElementById('results-pane');

dragBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'row-resize';
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = '';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const containerHeight = document.getElementById('split-container').clientHeight;
  const containerTop = document.getElementById('split-container').getBoundingClientRect().top;
  const newGraphHeight = e.clientY - containerTop;


  graphPane.style.flex = 'unset';
  graphPane.style.height = `${newGraphHeight}px`;
  resultsPane.style.flex = 'unset';
  resultsPane.style.height = `${containerHeight - newGraphHeight - dragBar.offsetHeight}px`;

  // Resize graphs after resizing
  const graphs = document.querySelectorAll('.graph-wrapper');
  graphs.forEach(g => Plotly.Plots.resize(g));
});


