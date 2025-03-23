export function fadeOut(element) {
  element.style.transition = "opacity 0.5s ease-out";
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, 500);
}

export function fadeIn(element, display = "block") {
  element.style.opacity = 0;
  element.style.display = display;
  element.style.transition = "opacity 0.5s ease-in";
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10);
}