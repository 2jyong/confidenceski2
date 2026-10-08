document.documentElement.classList.add('has-js');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '메뉴 열기');
  nav.classList.remove('open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('open', open);
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .01, rootMargin: '0px 0px 120px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
} else reveals.forEach(el => el.classList.add('is-visible'));

const count = document.querySelector('[data-count]');
if (count && 'IntersectionObserver' in window && !reduceMotion) {
  const countObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const target = Number(count.dataset.count);
    const started = performance.now();
    const step = now => {
      const t = Math.min((now - started) / 1100, 1);
      count.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObserver.disconnect();
  }, { threshold: .5 });
  countObserver.observe(count);
}

if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main > section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-30% 0px -55% 0px' });
  sections.forEach(section => sectionObserver.observe(section));
}

const heroVideo = document.querySelector('.hero video');
if (heroVideo) {
  if (reduceMotion) heroVideo.pause();
  else heroVideo.play().catch(() => {});
}

