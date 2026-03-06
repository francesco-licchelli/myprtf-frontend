import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useScrollAnimation() {
  useEffect(() => {
    // Wait for DOM to be ready
    const ctx = gsap.context(() => {
      // Section titles
      gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.from(title, {
          scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
        })
      })

      // About bio
      gsap.utils.toArray('.about-bio').forEach((p, i) => {
        gsap.from(p, {
          scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 0, y: 30, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
        })
      })

      // Stat cards
      gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, scale: 0.9, duration: 0.6, stagger: 0.15, ease: 'back.out(1.4)',
      })

      // Timeline items
      gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
          opacity: 0, x: -40, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
        })
      })

      // Skill categories
      gsap.from('.skill-category', {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, scale: 0.95, duration: 0.6, stagger: 0.12, ease: 'power3.out',
      })

      // Skill items
      gsap.from('.skill-item', {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 75%', toggleActions: 'play none none none' },
        opacity: 0, y: 20, duration: 0.4, stagger: { each: 0.05, from: 'start' }, ease: 'power2.out',
      })

      // Contact
      gsap.from('.contact-text', {
        scrollTrigger: { trigger: '.contact-text', start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })
      gsap.from('.contact-btn', {
        scrollTrigger: { trigger: '.contact-links', start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, scale: 0.9, duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)',
      })
    })

    return () => ctx.revert()
  }, [])
}

export { gsap, ScrollTrigger }
