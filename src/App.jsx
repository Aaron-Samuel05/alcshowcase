import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { products } from './data/products'
import './index.css'

const positions = {
  hero: { x: '0vw', y: '0vh', scale: 1.2, rotation: 0, opacity: 1, filter: 'blur(0px)', zIndex: 4 },
  next: { x: '35vw', y: '2vh', scale: 0.42, rotation: 8, opacity: 0.5, filter: 'blur(5px)', zIndex: 2 },
  prev: { x: '-35vw', y: '2vh', scale: 0.42, rotation: -8, opacity: 0.5, filter: 'blur(5px)', zIndex: 2 },
  hiddenRight: { x: '64vw', y: '6vh', scale: 0.25, rotation: 13, opacity: 0, filter: 'blur(12px)', zIndex: 1 },
  hiddenLeft: { x: '-64vw', y: '6vh', scale: 0.25, rotation: -13, opacity: 0, filter: 'blur(12px)', zIndex: 1 },
}
const wrap = (n) => (n + products.length) % products.length

function App() {
  const [active, setActive] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)
  const activeRef = useRef(0), lockedRef = useRef(false), stageRef = useRef(null), bottleRefs = useRef([])
  const titleRef = useRef(null), infoRef = useRef(null), counterRef = useRef(null), actionRef = useRef(null)
  const detailRef = useRef(null), detailBottleRef = useRef(null), detailInfoRef = useRef(null), detailButtonRef = useRef(null)
  const current = products[active]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Establish the carousel geometry only. The showcase UI is intentionally
      // visible at its final opacity from the first paint so there is no flash
      // from opacity: 1 -> 0 -> 1 during hydration/initialisation.
      bottleRefs.current.forEach((node, i) => node && gsap.set(node, i === 0 ? positions.hero : i === 1 ? positions.next : i === products.length - 1 ? positions.prev : positions.hiddenRight))
      gsap.set(titleRef.current, { opacity: .22, y: 0, scale: 1, filter: 'blur(0px)' })
      gsap.set([infoRef.current, counterRef.current, actionRef.current], { opacity: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(['.stage-header', '.stage-foot'], { opacity: 1, y: 0 })
    }, stageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const preload = products.map(({ image }) => { const img = new Image(); img.src = image; return img })
    return () => preload.forEach((img) => { img.src = '' })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (detailOpen) { if (e.key === 'Escape') closeDetail(); return }
      if (e.key === 'ArrowRight') changeProduct(1)
      if (e.key === 'ArrowLeft') changeProduct(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function changeProduct(direction) {
    if (lockedRef.current || detailOpen) return
    lockedRef.current = true
    const old = activeRef.current, next = wrap(old + direction)
    const oldHero = bottleRefs.current[old], incoming = bottleRefs.current[next]
    const entering = bottleRefs.current[wrap(old + direction * 2)], exiting = bottleRefs.current[wrap(old - direction)]
    gsap.set(entering, direction > 0 ? positions.hiddenRight : positions.hiddenLeft)
    gsap.timeline({ defaults: { ease: 'power4.inOut' } })
      .to(stageRef.current, { '--tone-1': products[next].tones[0], '--tone-2': products[next].tones[1], '--tone-3': products[next].tones[2], '--accent': products[next].accent, duration: .95 }, 0)
      .to(oldHero, { ...(direction > 0 ? positions.prev : positions.next), duration: .92 }, 0)
      .to(incoming, { ...positions.hero, duration: .98 }, .03)
      .to(entering, { ...(direction > 0 ? positions.next : positions.prev), duration: .9 }, .08)
      .to(exiting, { ...(direction > 0 ? positions.hiddenLeft : positions.hiddenRight), duration: .72 }, 0)
      .to([titleRef.current, infoRef.current, counterRef.current, actionRef.current], { opacity: 0, y: -12, filter: 'blur(5px)', duration: .28, stagger: .025 }, 0)
      .call(() => { activeRef.current = next; setActive(next) }, [], .38)
      .fromTo([infoRef.current, counterRef.current, actionRef.current], { opacity: 0, y: 15, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .5, stagger: .04, ease: 'power3.out' }, .5)
      .fromTo(titleRef.current, { opacity: 0, y: 15, filter: 'blur(5px)' }, { opacity: .22, y: 0, filter: 'blur(0px)', duration: .5, ease: 'power3.out' }, .5)
      .eventCallback('onComplete', () => { lockedRef.current = false })
  }

  const onPointerMove = (e) => {
    const r = stageRef.current.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width - .5) * 2, y = ((e.clientY - r.top) / r.height - .5) * 2
    gsap.to(stageRef.current, { '--parallax-x': `${x * 7}px`, '--parallax-y': `${y * 5}px`, '--glow-x': `${50 + x * 13}%`, '--glow-y': `${46 + y * 10}%`, duration: .9, ease: 'power3.out', overwrite: 'auto' })
  }
  const onWheel = (e) => { e.preventDefault(); if (detailOpen || Math.abs(e.deltaY) < 8) return; changeProduct(e.deltaY > 0 ? 1 : -1) }

  const openDetail = () => {
    if (lockedRef.current || detailOpen) return
    lockedRef.current = true
    const hero = bottleRefs.current[activeRef.current]
    const otherBottles = bottleRefs.current.filter((node) => node && node !== hero)
    setDetailOpen(true)

    requestAnimationFrame(() => {
      if (!hero || !detailRef.current || !detailInfoRef.current || !detailButtonRef.current) { lockedRef.current = false; return }
      gsap.killTweensOf([hero, ...otherBottles, detailRef.current, detailInfoRef.current, detailButtonRef.current])
      gsap.set(detailRef.current, { opacity: 1, filter: 'blur(0px)' })
      gsap.set(detailInfoRef.current, { opacity: 0, x: -70, filter: 'blur(10px)' })
      gsap.set(detailButtonRef.current, { opacity: 0, y: -8, x: 0, filter: 'blur(0px)' })
      gsap.set(detailBottleRef.current, { opacity: 0 })

      gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => { lockedRef.current = false } })
        .to([titleRef.current, infoRef.current, counterRef.current, actionRef.current], { opacity: 0, y: -18, filter: 'blur(6px)', duration: .28, stagger: .02 }, 0)
        .to(otherBottles, { opacity: 0, scale: .72, filter: 'blur(12px)', duration: .42, stagger: .015, ease: 'power3.out' }, 0)
        .to(hero, { x: '25vw', y: '0vh', scale: 1.32, rotation: 0, opacity: 1, filter: 'blur(0px)', zIndex: 60, duration: .9, ease: 'power4.inOut' }, .03)
        .to(detailInfoRef.current, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .72, ease: 'power3.out' }, .32)
        .to(detailButtonRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .45, ease: 'power3.out' }, .4)
    })
  }

  const closeDetail = () => {
    if (!detailOpen || lockedRef.current) return
    lockedRef.current = true
    const hero = bottleRefs.current[activeRef.current]
    const otherBottles = bottleRefs.current.filter((node) => node && node !== hero)
    if (!hero || !detailRef.current || !detailInfoRef.current || !detailButtonRef.current) { lockedRef.current = false; return }
    gsap.killTweensOf([hero, ...otherBottles, detailRef.current, detailInfoRef.current, detailButtonRef.current, titleRef.current, infoRef.current, counterRef.current, actionRef.current])

    gsap.set(titleRef.current, { opacity: .22, y: 0, filter: 'blur(0px)', scale: 1 })

    gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => {
      otherBottles.forEach((node) => {
        const index = bottleRefs.current.indexOf(node)
        const next = activeRef.current === index + 1 || (activeRef.current === 0 && index === products.length - 1)
        const prev = activeRef.current === index - 1 || (activeRef.current === products.length - 1 && index === 0)
        gsap.set(node, next ? positions.next : prev ? positions.prev : positions.hiddenRight)
      })
      gsap.set(hero, positions.hero)
      gsap.set(titleRef.current, { opacity: .22, y: 0, filter: 'blur(0px)', scale: 1 })
      gsap.set(infoRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(counterRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(actionRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(detailButtonRef.current, { opacity: 0, y: -8, x: 0, filter: 'blur(0px)' })
      setDetailOpen(false)
      lockedRef.current = false
    } })
      .to([detailInfoRef.current, detailButtonRef.current], { opacity: 0, x: -30, y: -8, filter: 'blur(6px)', duration: .28, stagger: .03 }, 0)
      .to(detailRef.current, { opacity: 0, filter: 'blur(0px)', duration: .35 }, .12)
      .to(hero, { x: '0vw', y: '0vh', scale: 1.2, opacity: 1, zIndex: 4, filter: 'blur(0px)', duration: .72, ease: 'power4.inOut' }, .2)
      .to([titleRef.current, infoRef.current, counterRef.current, actionRef.current], { opacity: 1, y: 0, filter: 'blur(0px)', duration: .48, stagger: .03, ease: 'power3.out' }, .38)
  }

  return <main ref={stageRef} className={`showcase ${detailOpen ? 'is-detail' : ''}`} onPointerMove={onPointerMove} onWheel={onWheel} style={{ '--tone-1': current.tones[0], '--tone-2': current.tones[1], '--tone-3': current.tones[2], '--accent': current.accent }}>
    <div className="atmosphere" aria-hidden="true"><span className="orb orb-one" /><span className="orb orb-two" /><span className="grain" /></div>
    <header className="stage-header"><a className="brand" href="#top">NOIR <em>DISTILLERY</em></a><span className="edition">CURATED SPIRITS / 2026</span></header>
    <section className="product-stage" aria-label="Noir Distillery bottle showcase"><div className="title-wrap" ref={titleRef} aria-hidden="true"><p>THE PRIVATE COLLECTION</p><h1>{current.displayTitle}</h1></div>{products.map((p, i) => <img key={p.id} ref={(node) => { bottleRefs.current[i] = node }} className={`bottle bottle-${p.id}`} src={p.image} alt={p.name} draggable="false" />)}<div className="stage-caption stage-caption-left"><span>PREVIOUS</span><i /></div><div className="stage-caption stage-caption-right"><i /><span>NEXT</span></div></section>
    <footer className="stage-foot"><section className="product-info" ref={infoRef} aria-live="polite"><p className="eyebrow">{current.series}</p><h2>{current.name}</h2><p className="category">{current.category}</p><p className="description">{current.description}</p><nav className="navigation" aria-label="Product navigation"><button type="button" onClick={() => changeProduct(-1)} aria-label="Previous bottle">←</button><button type="button" onClick={() => changeProduct(1)} aria-label="Next bottle">→</button></nav></section><section className="product-action"><button className="explore" ref={actionRef} type="button" onClick={openDetail}>EXPLORE BOTTLE <span>→</span></button><p className="counter" ref={counterRef}><b>{String(active + 1).padStart(2, '0')}</b> / {String(products.length).padStart(2, '0')}</p></section></footer>
    <section className="detail-view" ref={detailRef} aria-hidden={!detailOpen} aria-label={`${current.name} details`}>
      <button className="detail-back" ref={detailButtonRef} type="button" onClick={closeDetail} aria-label="Back to bottle showcase"><span>←</span> BACK</button>
      <div className="detail-copy" ref={detailInfoRef}><p className="eyebrow">{current.category}</p><h2>{current.name}</h2><p className="detail-description">{current.detail}</p><dl><div><dt>STYLE</dt><dd>{current.style}</dd></div><div><dt>ORIGIN</dt><dd>{current.origin}</dd></div></dl></div>
      <div className="detail-bottle-wrap" aria-hidden="true"><img className="detail-bottle" ref={detailBottleRef} src={current.image} alt="" draggable="false" /></div>
    </section>
  </main>
}

export default App
