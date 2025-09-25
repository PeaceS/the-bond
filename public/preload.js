// Add a listener for the DomContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  // Your preloading script goes here
  for (let id = 1; id <= 100; id++) {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = `images/the-bond/${id}/a.jpg`;
    document.head.appendChild(preloadLink);
  }
});
