const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('.filter');
const indexItems = document.querySelectorAll('.index-item');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    indexItems.forEach((item) => {
      const categories = item.dataset.category || '';
      item.hidden = filter !== 'all' && !categories.includes(filter);
    });
  });
});

const progress = document.querySelector('.cinema-progress');
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

window.addEventListener('pointermove', (event) => {
  document.body.style.setProperty('--mx', `${(event.clientX / window.innerWidth) * 100}%`);
  document.body.style.setProperty('--my', `${(event.clientY / window.innerHeight) * 100}%`);
  const portrait = document.querySelector('[data-depth]');
  if (portrait && window.innerWidth > 760) {
    const y = (event.clientY / window.innerHeight - 0.5) * -18;
    portrait.style.setProperty('--depth-y', `${y}px`);
  }
}, { passive: true });

document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 760) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.012)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => item.style.color = item.getAttribute('href') === `#${entry.target.id}` ? 'var(--acid)' : '');
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));
