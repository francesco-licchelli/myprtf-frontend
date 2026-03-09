import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('astro:page-load', () => {
  // Section titles
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
    });
  });

  // About bio
  gsap.utils.toArray('.about-bio').forEach((p, i) => {
    gsap.from(p, {
      scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
    });
  });

  // Stat cards
  const statsEl = document.querySelector('.about-stats');
  if (statsEl) {
    gsap.from('.stat-card', {
      scrollTrigger: { trigger: '.about-stats', start: 'top 80%', toggleActions: 'play none none none' },
      opacity: 0, y: 40, scale: 0.9, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)',
    });
  }

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 95%', toggleActions: 'play none none none' },
      opacity: 0, x: -40, duration: 0.7, ease: 'power3.out',
    });
  });

  // Skill categories
  gsap.utils.toArray('.skills-category').forEach((cat) => {
    gsap.from(cat, {
      scrollTrigger: { trigger: cat, start: 'top 95%', toggleActions: 'play none none none' },
      opacity: 0, y: 30, duration: 0.6, ease: 'power3.out',
    });
  });
});
