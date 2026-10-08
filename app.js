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

const coachData = {
  director: { name: '이상혁', role: 'DIRECTOR / 원장', image: 'assets/coach-director.webp', career: ['체육학과 · 주니어 기술등급제 심사위원', 'KSIA · SBAK · ISIA 스키지도자 · 생활체육지도자'] },
  jjg: { name: '정준길', role: 'HEAD COACH / 수석 코치', image: 'assets/coach-jjg.webp', career: ['체육학과 · 만 16세 지도자 자격 획득', '컨피던스스키 아카데미 4년 차', 'KSIA · SBAK 스키지도자'] },
  ysw: { name: '양승우', role: 'HEAD COACH / 수석 코치', image: 'assets/coach-ysw.webp', career: ['레저스포츠학과 · 컨피던스스키 아카데미 4년 차', '양지파인리조트 패트롤 · 스타힐 스키학교', 'KSIA · SBAK 스키지도자'] },
  lgm: { name: '이건명', role: 'COACH / 코치', image: 'assets/coach-lgm.webp', career: ['체육교육학과 · 컨피던스스키 아카데미 3년 차', '스타힐 스키학교 · KSIA · SBAK 스키지도자'] },
  bsy: { name: '백서윤', role: 'COACH / 코치', image: 'assets/coach-bsy.webp', career: ['알파인 선수 출신 · 주니어 기선전 2위', '각종 대회 다수 입상'] },
  jjy: { name: '장준용', role: 'COACH / 코치', image: 'assets/coach-jjy.webp', career: ['KSIA · SBAK 스키지도자'] }
};
const coachFeature = document.querySelector('#coach-feature');
const coachButtons = [...document.querySelectorAll('[data-coach]')];
let coachTimer;
let selectedCoach = 'director';
coachButtons.forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.coach;
  if (key === selectedCoach || !coachData[key]) return;
  selectedCoach = key;
  coachButtons.forEach(item => {
    const active = item.dataset.coach === key;
    item.classList.toggle('is-selected', active);
    item.setAttribute('aria-pressed', String(active));
  });
  clearTimeout(coachTimer);
  coachFeature.classList.add('is-switching');
  const show = () => {
    const coach = coachData[key];
    const photo = document.querySelector('#coach-feature-image');
    photo.src = coach.image;
    photo.alt = `${coach.role.split('/')[1].trim()} ${coach.name}`;
    document.querySelector('#coach-feature-role').textContent = coach.role;
    document.querySelector('#coach-feature-name').textContent = coach.name;
    document.querySelector('#coach-feature-career').textContent = coach.career.join('\n');
    coachFeature.classList.remove('is-switching');
  };
  coachTimer = setTimeout(show, reduceMotion ? 0 : 160);
}));

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
  count.textContent = '0';
  const countObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const target = Number(count.dataset.count);
    const started = performance.now();
    const step = now => {
      const t = Math.min((now - started) / 750, 1);
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
