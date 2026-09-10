(() => {
  const histories = {
    'New Amsterdam': {
      title: 'A modern New York spirit.',
      story: 'New Amsterdam is built around a clean, approachable vodka style with a distinctly contemporary New York identity. Its character is intentionally polished and versatile, designed to work just as naturally in a simple pour as it does in a crafted cocktail.',
      history: 'The brand takes its name from the original Dutch settlement that became New York City, connecting the bottle to the city’s early identity while presenting it through a modern spirits lens.',
      craft: 'A deliberately contemporary expression: clean, versatile and made to keep the focus on the drink rather than overpower it.'
    },
    'Captain Morgan': {
      title: 'Born from Caribbean rum culture.',
      story: 'Captain Morgan is defined by a rich rum base layered with warm spice and caramel character. The result is a fuller, darker profile that has become closely associated with relaxed Caribbean-inspired drinking and long, social nights.',
      history: 'The brand is named after Sir Henry Morgan, the Welsh privateer who became governor of Jamaica in the 17th century. Its identity draws heavily from the island’s rum heritage and maritime folklore.',
      craft: 'Warm, rounded and unmistakably spiced, the expression leans into the generous character that makes rum work so well in long drinks and shared occasions.'
    },
    'Hendrick’s': {
      title: 'An eccentric approach to gin.',
      story: 'Hendrick’s takes a deliberately unconventional route to gin, combining a botanical foundation with the distinctive influence of rose and cucumber. The result is floral, fresh and unmistakably different from a traditional London-style profile.',
      history: 'Hendrick’s was introduced in Scotland in the late 1990s and became known for pairing traditional gin distillation with an unusually expressive botanical recipe and a distinctive apothecary-inspired identity.',
      craft: 'Rose brings a soft floral lift while cucumber gives the profile its cool, fresh edge — a pairing that became central to the brand’s signature character.'
    },
    'Appleton Estate V/X': {
      title: 'Jamaican rum with estate heritage.',
      story: 'Appleton Estate V/X reflects Jamaica’s deep rum-making tradition, bringing together rounded molasses character, warm spice and tropical fruit notes. Its style is generous and approachable while retaining the depth associated with aged Jamaican rum.',
      history: 'Appleton Estate traces its roots to Jamaica’s Nassau Valley, where rum has been produced for centuries. The estate’s heritage is closely tied to Jamaican sugarcane, local fermentation and the island’s distinctive pot-still tradition.',
      craft: 'Jamaica’s landscape and production traditions shape the profile: tropical richness, warm spice and the distinctive depth associated with estate-made rum.'
    }
  }

  const clamp01 = (value) => Math.max(0, Math.min(1, value))
  const smoothstep = (value) => {
    const t = clamp01(value)
    return t * t * (3 - 2 * t)
  }

  function buildDetails(view) {
    if (!view) return
    let content = view.querySelector('.detail-scroll-content')
    if (!content) {
      content = document.createElement('div')
      content.className = 'detail-scroll-content'
      view.appendChild(content)
    }

    const name = view.querySelector('.detail-copy h2')?.textContent?.trim() || 'Selected Bottle'
    const category = view.querySelector('.detail-copy .eyebrow')?.textContent?.trim() || ''
    const facts = [...view.querySelectorAll('.detail-copy dl dd')].map((el) => el.textContent.trim())
    const story = histories[name] || {
      title: `The character of ${name}.`,
      story: `A carefully composed ${category.toLowerCase()} selected for its distinctive character, balance and place within the collection.`,
      history: 'Its story is rooted in the traditions, ingredients and craft that define its category.',
      craft: 'Its production character is part of what gives this expression its place within the collection.'
    }

    content.innerHTML = `
      <div class="detail-scroll-spacer"></div>
      <div class="detail-scroll-section detail-scroll-story-section">
        <div class="detail-scroll-inner">
          <p class="detail-scroll-kicker">01 / THE STORY</p>
          <h3 class="detail-scroll-title">${story.title}</h3>
          <p class="detail-scroll-copy">${story.story}</p>
          <div class="detail-scroll-grid">
            <div class="detail-scroll-fact"><span>STYLE</span><strong>${facts[0] || 'Signature expression'}</strong></div>
            <div class="detail-scroll-fact"><span>ORIGIN</span><strong>${facts[1] || '—'}</strong></div>
            <div class="detail-scroll-fact"><span>CATEGORY</span><strong>${category}</strong></div>
          </div>
        </div>
      </div>
      <div class="detail-scroll-section detail-scroll-heritage-section">
        <div class="detail-scroll-inner detail-scroll-story">
          <h3>Heritage</h3>
          <div class="detail-scroll-heritage-copy">
            <p>${story.history}</p>
            <p>${story.craft}</p>
            <div class="detail-scroll-callout">
              <span>03 / CHARACTER</span>
              <strong>${facts[0] || 'SIGNATURE EXPRESSION'} · ${facts[1] || 'ORIGIN'} · ${category}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-scroll-section detail-scroll-end">
        <div>
          <p>END OF EDITION</p>
          <h3>${name}</h3>
          <div class="detail-scroll-end-meta">
            <span>${category}</span>
            <span>${facts[1] || 'SELECTED ORIGIN'}</span>
            <span>${facts[0] || 'SIGNATURE STYLE'}</span>
          </div>
        </div>
      </div>
    `

    if (!view.querySelector('.detail-scroll-hint')) {
      const hint = document.createElement('div')
      hint.className = 'detail-scroll-hint'
      hint.innerHTML = 'SCROLL TO DISCOVER<span>↓</span>'
      view.appendChild(hint)
    }
  }

  function captureHeroGeometry(view) {
    const copy = view.querySelector('.detail-copy')
    if (!copy) return
    const rect = copy.getBoundingClientRect()
    view.dataset.heroShift = String((window.innerWidth / 2) - (rect.left + rect.width / 2))
  }

  function updateHeroScroll(view) {
    const showcase = document.querySelector('.showcase')
    const copy = view.querySelector('.detail-copy')
    if (!showcase || !copy) return

    if (!view.dataset.heroShift) captureHeroGeometry(view)

    const progress = clamp01(view.scrollTop / Math.max(1, window.innerHeight * 0.82))
    const eased = smoothstep(progress)
    const heroShift = Number.parseFloat(view.dataset.heroShift || '0')

    copy.style.setProperty('--scroll-x', `${heroShift * eased}px`)
    copy.style.setProperty('--scroll-y', `${-8 * eased}px`)
    copy.style.setProperty('--scroll-scale', `${1 - eased * 0.035}`)

    const bottleProgress = smoothstep(progress / 0.9)
    const bottleOpacity = 1 - bottleProgress
    const bottles = document.querySelectorAll('.showcase.is-detail .bottle')
    bottles.forEach((bottle) => {
      const isHero = Number.parseInt(getComputedStyle(bottle).zIndex || '0', 10) >= 50
      if (isHero) {
        bottle.style.opacity = String(bottleOpacity)
        bottle.style.filter = `drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(${bottleProgress * 4}px)`
      }
    })

    const copyFade = smoothstep((progress - 0.72) / 0.28)
    copy.style.opacity = String(1 - copyFade * 0.9)
    showcase.classList.toggle('detail-scrolled', progress > 0.04)
  }

  function resetScroll(view) {
    view.scrollTop = 0
    const showcase = document.querySelector('.showcase')
    const copy = view.querySelector('.detail-copy')
    showcase?.classList.remove('detail-scrolled')
    if (copy) {
      copy.style.setProperty('--scroll-x', '0px')
      copy.style.setProperty('--scroll-y', '0px')
      copy.style.setProperty('--scroll-scale', '1')
      copy.style.opacity = ''
    }
    delete view.dataset.heroShift
    document.querySelectorAll('.showcase .bottle').forEach((bottle) => {
      bottle.style.opacity = ''
      bottle.style.filter = ''
    })
    requestAnimationFrame(() => {
      view.scrollTop = 0
      captureHeroGeometry(view)
      showcase?.classList.remove('detail-scrolled')
      updateHeroScroll(view)
    })
  }

  function init(view) {
    if (!view || view.dataset.scrollReady === 'true') return
    view.dataset.scrollReady = 'true'

    view.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true })
    view.addEventListener('scroll', () => updateHeroScroll(view), { passive: true })
    window.addEventListener('resize', () => {
      if (view.getAttribute('aria-hidden') === 'false') {
        captureHeroGeometry(view)
        updateHeroScroll(view)
      }
    }, { passive: true })

    const observer = new MutationObserver(() => {
      const isOpen = view.getAttribute('aria-hidden') === 'false'
      buildDetails(view)
      if (isOpen) resetScroll(view)
    })
    observer.observe(view, { attributes: true, attributeFilter: ['aria-hidden'] })

    buildDetails(view)
    if (view.getAttribute('aria-hidden') === 'false') resetScroll(view)
  }

  const boot = () => {
    const view = document.querySelector('.detail-view')
    if (view) init(view)
  }

  new MutationObserver(boot).observe(document.body, { childList: true, subtree: true })
  boot()
})()
