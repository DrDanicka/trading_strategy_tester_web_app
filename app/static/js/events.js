// Re-resize all Plotly graphs when the window size changes
window.addEventListener('resize', () => {
  const graphs = document.querySelectorAll('.graph-wrapper');
  graphs.forEach(g => Plotly.Plots.resize(g));
});

// Enable submitting the prompt by pressing Enter inside the prompt input field
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('prompt');

    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        window.submitPrompt();
      }
    });
});

// === Drag bar logic for resizing graph and results panes ===

let isDragging = false;
const dragBar = document.getElementById('drag-bar');
const graphPane = document.getElementById('graph-pane');
const resultsPane = document.getElementById('results-pane');

// Start dragging when the mouse is pressed on the drag bar
dragBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  document.body.style.cursor = 'row-resize'; // Change cursor to indicate resizing
});

// Stop dragging when the mouse is released
document.addEventListener('mouseup', () => {
  isDragging = false;
  document.body.style.cursor = ''; // Reset cursor
});

// Handle resizing while dragging the drag bar
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const container = document.getElementById('split-container');
  const containerHeight = container.clientHeight;
  const containerTop = container.getBoundingClientRect().top;
  const newGraphHeight = e.clientY - containerTop;

  // Set new heights for graph and results panes manually
  graphPane.style.flex = 'unset';
  graphPane.style.height = `${newGraphHeight}px`;
  resultsPane.style.flex = 'unset';
  resultsPane.style.height = `${containerHeight - newGraphHeight - dragBar.offsetHeight}px`;

  // Resize Plotly graphs to fit new pane sizes
  const graphs = document.querySelectorAll('.graph-wrapper');
  graphs.forEach(g => Plotly.Plots.resize(g));
});
