export function adjustWidth() {
    const input = document.getElementById('prompt');
    const mirror = document.getElementById('input-mirror');

    // Update mirror content to match input content
    mirror.textContent = input.value || input.placeholder;

    // Set input width based on mirror width
    const newWidth = mirror.offsetWidth;

    const minWidth = 300;
    const maxWidth = 600;

    input.style.width = Math.min(maxWidth, Math.max(minWidth, newWidth)) + 'px';
}