import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { products } from './data/products'
import './index.css'

const positions = {
  hero: { x: '0vw', y: '0vh', scale: 1.2, rotation: 0, opacity: 1, blur: 0, zIndex: 4 },
  next: { x: '35vw', y: '2vh', scale: 0.42, rotation: 8, opacity: 0.5, blur: 5, zIndex: 2 },
  prev: { x: '-35vw', y: '2vh', scale: 0.42, rotation: -8, opacity: 0.5, blur: 5, zIndex: 2 },
  hiddenRight: { x: '64vw', y: '6vh', scale: 0.25, rotation: 13, opacity: 0, blur: 12, zIndex: 1 },
  hiddenLeft: { x: '-64vw', y: '6vh', scale: 0.25, rotation: -13, opacity: 0, blur: 12, zIndex: 1 },
}

const wrap = (n) => (n + products.length) % products.length

function setBottlePosition(node, position) {
  if (!node) return
  gsap.set(node, {
    '--base-x': position.x,
    '--base-y': position.y,
    '--base-scale': position.scale,
    '--base-rotation': `${position.rotation}deg`,
    opacity: position.opacity,
    filter: `drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(${position.blur}px)`,
    zIndex: position.zIndex,
  })
}

function animateBottlePosition(timeline, node, position, duration, at = 0) {
  if (!node) return
  timeline.to(node, {
    '--base-x': position.x,
    '--base-y': position.y,
    '--base-scale': position.scale,
    '--base-rotation': `${position.rotation}deg`,
    opacity: position.opacity,
    filter: `drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(${position.blur}px)`,
    zIndex: position.zIndex,
    duration,
  }, at)
}

function App() {
  const [active, setActive] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)

  const activeRef = useRef(0)
  const lockedRef = useRef(false)
  const stageRef = useRef(null)
  const bottleRefs = useRef([])
  const titleRef = useRef(null)
  const infoRef = useRef(null)
  const counterRef = useRef(null)
  const actionRef = useRef(null)
  const detailRef = useRef(null)
  const detailInfoRef = useRef(null)
  const detailButtonRef = useRef(null)

  const current = products[active]

  useLayoutEffect(() => {
    bottleRefs.current.forEach((node, i) => {
      if (!node) return
      const position =
        i === activeRef.current
          ? positions.hero
          : i === wrap(activeRef.current + 1)
            ? positions.next
            : i === wrap(activeRef.current - 1)
              ? positions.prev
              : positions.hiddenRight
      setBottlePosition(node, position)
      gsap.set(node, {
        '--parallax-x': '0px',
        '--parallax-y': '0px',
        '--parallax-rx': '0deg',
        '--parallax-ry': '0deg',
      })
    })

    if (titleRef.current) {
      gsap.set(titleRef.current, {
        '--parallax-x': '0px',
        '--parallax-y': '0px',
        '--parallax-rx': '0deg',
        '--parallax-ry': '0deg',
        opacity: 0.22,
      })
    }

    if (detailInfoRef.current) {
      gsap.set(detailInfoRef.current, {
        '--parallax-x': '0px',
        '--parallax-y': '0px',
        '--parallax-rx': '0deg',
        '--parallax-ry': '0deg',
      })
    }
  }, [])

  useEffect(() => {
    const preload = products.map(({ image }) => {
      const img = new Image()
      img.src = image
      return img
    })
    return () => preload.forEach((img) => { img.src = '' })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (detailOpen) {
        if (e.key === 'Escape') closeDetail()
        return
      }
      if (e.key === 'ArrowRight') changeProduct(1)
      if (e.key === 'ArrowLeft') changeProduct(-1)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function resetParallax(immediate = true) {
    const targets = [titleRef.current, detailInfoRef.current, ...bottleRefs.current].filter(Boolean)
    gsap.killTweensOf(targets)

    const vars = {
      '--parallax-x': '0px',
      '--parallax-y': '0px',
      '--parallax-rx': '0deg',
      '--parallax-ry': '0deg',
      duration: immediate ? 0 : 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    }

    targets.forEach((node) => immediate ? gsap.set(node, vars) : gsap.to(node, vars))
  }

  function changeProduct(direction) {
    if (lockedRef.current || detailOpen) return

    lockedRef.current = true
    resetParallax(true)

    const old = activeRef.current
    const next = wrap(old + direction)
    const oldHero = bottleRefs.current[old]
    const incoming = bottleRefs.current[next]
    const entering = bottleRefs.current[wrap(old + direction * 2)]
    const exiting = bottleRefs.current[wrap(old - direction)]

    setBottlePosition(entering, direction > 0 ? positions.hiddenRight : positions.hiddenLeft)
    setBottlePosition(incoming, direction > 0 ? positions.hiddenRight : positions.hiddenLeft)

    gsap.killTweensOf([
      titleRef.current,
      infoRef.current,
      counterRef.current,
      actionRef.current,
      oldHero,
      incoming,
      entering,
      exiting,
    ])

    const timeline = gsap.timeline({
      defaults: { ease: 'power4.inOut' },
      onComplete: () => {
        activeRef.current = next
        setActive(next)
        resetParallax(true)
        lockedRef.current = false
      },
    })

    timeline.to(stageRef.current, {
      '--tone-1': products[next].tones[0],
      '--tone-2': products[next].tones[1],
      '--tone-3': products[next].tones[2],
      '--accent': products[next].accent,
      duration: 0.95,
    }, 0)

    animateBottlePosition(timeline, oldHero, direction > 0 ? positions.prev : positions.next, 0.92, 0)
    animateBottlePosition(timeline, incoming, positions.hero, 0.98, 0.03)
    animateBottlePosition(timeline, entering, direction > 0 ? positions.next : positions.prev, 0.9, 0.08)
    animateBottlePosition(timeline, exiting, direction > 0 ? positions.hiddenLeft : positions.hiddenRight, 0.72, 0)

    timeline
      .to([titleRef.current, infoRef.current, counterRef.current, actionRef.current], {
        opacity: 0,
        y: -12,
        filter: 'blur(5px)',
        duration: 0.28,
        stagger: 0.025,
      }, 0)
      .call(() => {
        activeRef.current = next
        setActive(next)
      }, [], 0.38)
      .fromTo([infoRef.current, counterRef.current, actionRef.current],
        { opacity: 0, y: 15, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.04, ease: 'power3.out' },
        0.5,
      )
      .fromTo(titleRef.current,
        { opacity: 0, y: 15, filter: 'blur(5px)' },
        { opacity: 0.22, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' },
        0.5,
      )
  }

  const onPointerMove = (e) => {
    if (!stageRef.current || lockedRef.current) return

    const r = stageRef.current.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))

    gsap.to(stageRef.current, {
      '--parallax-x': `${x * 3}px`,
      '--parallax-y': `${y * 2}px`,
      '--glow-x': `${50 + x * 8}%`,
      '--glow-y': `${46 + y * 6}%`,
      duration: 0.65,
      ease: 'power3.out',
      overwrite: 'auto',
    })

    if (!detailOpen && titleRef.current) {
      gsap.to(titleRef.current, {
        '--parallax-x': `${x * 8}px`,
        '--parallax-y': `${y * 5}px`,
        '--parallax-rx': `${-y * 0.45}deg`,
        '--parallax-ry': `${x * 0.65}deg`,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const hero = bottleRefs.current[activeRef.current]
    if (hero) {
      gsap.to(hero, {
        '--parallax-x': `${x * (detailOpen ? 5 : 7)}px`,
        '--parallax-y': `${y * (detailOpen ? 3 : 4)}px`,
        '--parallax-rx': `${-y * 1.1}deg`,
        '--parallax-ry': `${x * 1.6}deg`,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    if (detailOpen && detailInfoRef.current) {
      gsap.to(detailInfoRef.current, {
        '--parallax-x': `${x * 6}px`,
        '--parallax-y': `${y * 4}px`,
        '--parallax-rx': `${-y * 0.35}deg`,
        '--parallax-ry': `${x * 0.55}deg`,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
  }

  const onPointerLeave = () => {
    if (lockedRef.current) return
    resetParallax(false)
    gsap.to(stageRef.current, {
      '--parallax-x': '0px',
      '--parallax-y': '0px',
      '--glow-x': '50%',
      '--glow-y': '46%',
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const onWheel = (e) => {
    e.preventDefault()
    if (detailOpen || Math.abs(e.deltaY) < 8) return
    changeProduct(e.deltaY > 0 ? 1 : -1)
  }

  const openDetail = () => {
    if (lockedRef.current || detailOpen) return

    lockedRef.current = true
    resetParallax(true)

    const hero = bottleRefs.current[activeRef.current]
    const otherBottles = bottleRefs.current.filter((node) => node && node !== hero)

    // Establish the complete detail state before making the overlay visible.
    gsap.set(detailRef.current, { opacity: 0 })
    gsap.set(detailInfoRef.current, {
      opacity: 0,
      x: -50,
      y: 0,
      filter: 'blur(8px)',
      '--parallax-x': '0px',
      '--parallax-y': '0px',
      '--parallax-rx': '0deg',
      '--parallax-ry': '0deg',
    })
    gsap.set(detailButtonRef.current, { opacity: 0, x: 0, y: -6, filter: 'blur(4px)' })

    setDetailOpen(true)

    requestAnimationFrame(() => {
      if (!hero || !detailRef.current || !detailInfoRef.current || !detailButtonRef.current) {
        lockedRef.current = false
        return
      }

      gsap.killTweensOf([
        hero,
        ...otherBottles,
        detailRef.current,
        detailInfoRef.current,
        detailButtonRef.current,
        titleRef.current,
        infoRef.current,
        counterRef.current,
        actionRef.current,
      ])

      // No opacity-to-1 initialization. The overlay and every child start hidden.
      gsap.set(detailRef.current, { opacity: 0 })
      gsap.set(otherBottles, { opacity: 0, scale: 0.72, filter: 'blur(12px)' })
      gsap.set(titleRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
      gsap.set(infoRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
      gsap.set(counterRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
      gsap.set(actionRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => { lockedRef.current = false },
      })

      timeline
        .to(detailRef.current, { opacity: 1, duration: 0.35 }, 0)
        .to(hero, {
          '--base-x': '25vw',
          '--base-y': '0vh',
          '--base-scale': 1.32,
          '--base-rotation': '0deg',
          opacity: 1,
          filter: 'drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(0px)',
          zIndex: 60,
          duration: 0.85,
          ease: 'power4.inOut',
        }, 0)
        .to(detailButtonRef.current, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'power3.out',
        }, 0.18)
        .to(detailInfoRef.current, {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
        }, 0.26)
    })
  }

  const closeDetail = () => {
    if (!detailOpen || lockedRef.current) return

    lockedRef.current = true
    resetParallax(true)

    const hero = bottleRefs.current[activeRef.current]
    const otherBottles = bottleRefs.current.filter((node) => node && node !== hero)

    if (!hero || !detailRef.current || !detailInfoRef.current || !detailButtonRef.current) {
      lockedRef.current = false
      return
    }

    gsap.killTweensOf([
      hero,
      ...otherBottles,
      detailRef.current,
      detailInfoRef.current,
      detailButtonRef.current,
      titleRef.current,
      infoRef.current,
      counterRef.current,
      actionRef.current,
    ])

    // Keep the homepage hidden while the detail view leaves. This prevents the
    // bright/full-opacity frame that previously appeared between screens.
    gsap.set(titleRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
    gsap.set(infoRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
    gsap.set(counterRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
    gsap.set(actionRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
    gsap.set(detailButtonRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
    gsap.set(detailInfoRef.current, { opacity: 1, x: 0, filter: 'blur(0px)' })

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        otherBottles.forEach((node) => {
          const index = bottleRefs.current.indexOf(node)
          const next = activeRef.current === wrap(index - 1)
          const prev = activeRef.current === wrap(index + 1)
          setBottlePosition(node, next ? positions.next : prev ? positions.prev : positions.hiddenRight)
        })

        setBottlePosition(hero, positions.hero)
        resetParallax(true)

        gsap.set(detailRef.current, { opacity: 0 })
        gsap.set(detailInfoRef.current, { opacity: 0, x: -50, filter: 'blur(8px)' })
        gsap.set(detailButtonRef.current, { opacity: 0, y: -6, filter: 'blur(4px)' })
        gsap.set(titleRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
        gsap.set(infoRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
        gsap.set(counterRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })
        gsap.set(actionRef.current, { opacity: 0, y: -18, filter: 'blur(6px)' })

        setDetailOpen(false)
        lockedRef.current = false

        requestAnimationFrame(() => {
          gsap.to([infoRef.current, counterRef.current, actionRef.current], {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.42,
            stagger: 0.035,
            ease: 'power3.out',
          })
          gsap.to(titleRef.current, {
            opacity: 0.22,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.45,
            ease: 'power3.out',
          })
        })
      },
    })

    timeline
      .to([detailInfoRef.current, detailButtonRef.current], {
        opacity: 0,
        x: -24,
        y: -6,
        filter: 'blur(5px)',
        duration: 0.24,
        stagger: 0.025,
      }, 0)
      .to(detailRef.current, { opacity: 0, duration: 0.35 }, 0.08)
      .to(hero, {
        '--base-x': '0vw',
        '--base-y': '0vh',
        '--base-scale': 1.2,
        '--base-rotation': '0deg',
        opacity: 1,
        zIndex: 4,
        filter: 'drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(0px)',
        duration: 0.72,
        ease: 'power4.inOut',
      }, 0.16)
  }

  return (
    <main
      ref={stageRef}
      className={`showcase ${detailOpen ? 'is-detail' : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
      style={{
        '--tone-1': current.tones[0],
        '--tone-2': current.tones[1],
        '--tone-3': current.tones[2],
        '--accent': current.accent,
      }}
    >
      <div className="atmosphere" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="grain" />
      </div>

      <header className="stage-header">
        <a className="brand" href="#top">NOIR <em>DISTILLERY</em></a>
        <span className="edition">CURATED SPIRITS / 2026</span>
      </header>

      <section className="product-stage" aria-label="Noir Distillery bottle showcase">
        <div className="title-wrap" ref={titleRef} aria-hidden="true">
          <p>THE PRIVATE COLLECTION</p>
          <h1>{current.displayTitle}</h1>
        </div>

        {products.map((p, i) => (
          <img
            key={p.id}
            ref={(node) => { bottleRefs.current[i] = node }}
            className={`bottle bottle-${p.id}`}
            src={p.image}
            alt={p.name}
            draggable="false"
          />
        ))}

        <div className="stage-caption stage-caption-left"><span>PREVIOUS</span><i /></div>
        <div className="stage-caption stage-caption-right"><i /><span>NEXT</span></div>
      </section>

      <footer className="stage-foot">
        <section className="product-info" ref={infoRef} aria-live="polite">
          <p className="eyebrow">{current.series}</p>
          <h2>{current.name}</h2>
          <p className="category">{current.category}</p>
          <p className="description">{current.description}</p>
          <nav className="navigation" aria-label="Product navigation">
            <button type="button" onClick={() => changeProduct(-1)} aria-label="Previous bottle">←</button>
            <button type="button" onClick={() => changeProduct(1)} aria-label="Next bottle">→</button>
          </nav>
        </section>

        <section className="product-action" ref={actionRef}>
          <button className="explore" type="button" onClick={openDetail}>EXPLORE BOTTLE <span>→</span></button>
          <p className="counter" ref={counterRef}><b>{String(active + 1).padStart(2, '0')}</b> / {String(products.length).padStart(2, '0')}</p>
        </section>
      </footer>

      <section className="detail-view" ref={detailRef} aria-hidden={!detailOpen} aria-label={`${current.name} details`}>
        <button className="detail-back" ref={detailButtonRef} type="button" onClick={closeDetail} aria-label="Back to bottle showcase">
          <span>←</span> BACK
        </button>

        <div className="detail-copy" ref={detailInfoRef}>
          <p className="eyebrow">{current.category}</p>
          <h2>{current.name}</h2>
          <p className="detail-description">{current.detail}</p>
          <dl>
            <div><dt>STYLE</dt><dd>{current.style}</dd></div>
            <div><dt>ORIGIN</dt><dd>{current.origin}</dd></div>
          </dl>
        </div>
      </section>
    </main>
  )
}

export default App
