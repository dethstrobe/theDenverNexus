document.addEventListener('DOMContentLoaded', () => {
  const opener = document.querySelector('.opener');
  const openerText = document.querySelector('.opener-text');
  const crawl = document.querySelector('.crawl');
  const logo = document.querySelector('.logo');
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Fade out opener
    const opacityValue = 1 - (scrollPosition / 300);
    openerText.style.opacity = Math.max(0, Math.min(1, opacityValue));
    if( opacityValue <= 0 ) {
      opener.style.display = 'none'; // Hide the opener when fully faded out
    }

    // Scale down logo
    const scaleValue = 1 - (scrollPosition / 800);
    logo.style.transform = `scale(${Math.max(0, scaleValue)})`;
    
    // Move crawl text
    const scrollProgress = scrollPosition / maxScroll;
    const slowedProgress = Math.log(scrollProgress * 9 + 1) / Math.log(10);
    const moveY = 100 - (slowedProgress * 100); // Start at 100vh and move up
    const rotateX = 60; // Keep constant angle
    crawl.style.transform = `translateZ(${moveY * 8}vh) rotateX(${rotateX}deg)`;
  });
});