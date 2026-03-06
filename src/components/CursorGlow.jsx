import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    const el = ref.current
    const onMove = (e) => {
      el.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`
    }
    document.addEventListener('mousemove', onMove)
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return <div className="cursor-glow" ref={ref} />
}
