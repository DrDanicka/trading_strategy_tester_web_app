/**
 * Fade out an element by transitioning its opacity to 0,
 * then hiding it completely after the animation finishes.
 *
 * @param {HTMLElement} element - The element to fade out.
 */
export function fadeOut(element) {
  element.style.transition = "opacity 0.5s ease-out";
  element.style.opacity = 0;

  // After the fade-out completes, set display to 'none'
  setTimeout(() => {
    element.style.display = "none";
  }, 500);
  element.classList.add('hidden');
}

/**
 * Fade in an element by making it visible and transitioning its opacity to 1.
 *
 * @param {HTMLElement} element - The element to fade in.
 * @param {string} [display="block"] - The display style to apply (defaults to 'block').
 */
export function fadeIn(element, display = "block") {
  element.classList.remove('hidden');
  element.style.opacity = 0;
  element.style.display = display;
  element.style.transition = "opacity 0.5s ease-in";

  // Delay the opacity change slightly to trigger the transition
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10);
}
