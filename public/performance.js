(() => {
  // Replace the React pointer handler's per-event GSAP allocations with one
  // requestAnimationFrame loop. The visual parallax is preserved, but there is
  // never a pile of competing tweens while the pointer is moving.
  let showcase = null
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0
  let raf = 0
  let activeBottle = null

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

  const findHero = () => {
    if (!showcase) return null
    if (showcase.classList.contains('is-detail')) {
      return showcase.querySelector('.bottle[data-bottle-active="true"]') || activeBottle
    }
    const bottles = showcase.querySelectorAll('.bottle')
    let best = null
    let bestOpacity = -1
    bottles.forEach((bottle) => {
      const opacity = parseFloat(getComputedStyle(bottle).opacity)
      if (opacity > bestOpacity) { bestOpacity = opacity; best = bottle }
    })
    return best || activeBottle
  }

  const tick = () => {
    raf = 0
    currentX += (targetX - currentX) * 0.13
    currentY += (targetY - currentY) * 0.13
    if (Math.abs(targetX-currentX) < .05) currentX = targetX
    if (Math.abs(targetY-currentY) < .05) currentY = targetY

    if (showcase) {
      showcase.style.setProperty('--parallax-x', `${currentX * 3}px`)
      showcase.style.setProperty('--parallax-y', `${currentY * 2}px`)
      showcase.style.setProperty('--glow-x', `${50 + currentX * 8}%`)
      showcase.style.setProperty('--glow-y', `${46 + currentY * 6}%`)
      const hero = findHero()
      if (hero) {
        hero.style.setProperty('--parallax-x', `${currentX * (showcase.classList.contains('is-detail') ? 5 : 7)}px`)
        hero.style.setProperty('--parallax-y', `${currentY * (showcase.classList.contains('is-detail') ? 3 : 4)}px`)
        hero.style.setProperty('--parallax-rx', `${-currentY * 1.1}deg`)
        hero.style.setProperty('--parallax-ry', `${currentX * 1.6}deg`)
      }
      if (showcase.classList.contains('is-detail')) {
        const copy = showcase.querySelector('.detail-copy')
        if (copy) {
          copy.style.setProperty('--parallax-x', `${currentX * 6}px`)
          copy.style.setProperty('--parallax-y', `${currentY * 4}px`)
          copy.style.setProperty('--parallax-rx', `${-currentY * .35}deg`)
          copy.style.setProperty('--parallax-ry', `${currentX * .55}deg`)
        }
      }
    }
    if (Math.abs(targetX-currentX) > .05 || Math.abs(targetY-currentY) > .05) raf = requestAnimationFrame(tick)
  }

  const start = () => { if (!raf) raf = requestAnimationFrame(tick) }
  const move = (event) => {
    showcase = document.querySelector('.showcase')
    if (!showcase || showcase.classList.contains('detail-closing')) return
    const r = showcase.getBoundingClientRect()
    targetX = clamp(((event.clientX-r.left)/r.width-.5)*2, -1, 1)
    targetY = clamp(((event.clientY-r.top)/r.height-.5)*2, -1, 1)
    activeBottle = findHero()
    start()
    // Stop the expensive React onPointerMove handler from running too.
    event.stopPropagation()
  }
  const leave = () => { targetX = 0; targetY = 0; start() }

  document.addEventListener('pointermove', move, true)
  document.addEventListener('pointerleave', leave, true)
})()
