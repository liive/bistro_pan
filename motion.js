(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const animations = new Set();
  const play = (element, frames, options) => {
    if (preference.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.onfinish = () => animations.delete(animation);
  };
  if (!preference.matches) {
    document.querySelectorAll('h1 > span, .hero-copy, .hero-photo').forEach((element, index) => {
      play(element, [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], {
        duration: 800, delay: index * 110, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards'
      });
    });
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          play(entry.target, [{ opacity: .25, transform: 'translateY(25px)' }, { opacity: 1, transform: 'translateY(0)' }], {
            duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)'
          });
          observer.unobserve(entry.target);
        });
      }, { threshold: .12 });
      document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    }
  }
  const stopMotion = () => {
    if (!preference.matches) return;
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  };
  preference.addEventListener('change', stopMotion);
})();
