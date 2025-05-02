/**
 * Dynamically adjust the width of the prompt input field based on its content.
 * Uses a hidden "mirror" element to measure the text width.
 */
export function adjustWidth() {
    const input = document.getElementById('prompt');
    const mirror = document.getElementById('input-mirror');

    // Update mirror content to match the input's current value (or fallback to placeholder)
    mirror.textContent = input.value || input.placeholder;

    // Measure the mirror's width to determine how wide the input should be
    const newWidth = mirror.offsetWidth;

    // Set minimum and maximum width bounds (px)
    const minWidth = 300;
    const maxWidth = 600;

    // Apply the new width, clamped between min and max
    input.style.width = Math.min(maxWidth, Math.max(minWidth, newWidth)) + 'px';
}
