(() => {
  const histories = {
    'New Amsterdam': {
      title: 'A modern New York spirit.',
      story: 'New Amsterdam is built around a clean, approachable vodka style with a distinctly contemporary New York identity. Its character is intentionally polished and versatile, designed to work just as naturally in a simple pour as it does in a crafted cocktail.',
      history: 'The brand takes its name from the original Dutch settlement that became New York City, connecting the bottle to the city’s early identity while presenting it through a modern spirits lens.'
    },
    'Captain Morgan': {
      title: 'Born from Caribbean rum culture.',
      story: 'Captain Morgan is defined by a rich rum base layered with warm spice and caramel character. The result is a fuller, darker profile that has become closely associated with relaxed Caribbean-inspired drinking and long, social nights.',
      history: 'The brand is named after Sir Henry Morgan, the Welsh privateer who became governor of Jamaica in the 17th century. Its identity draws heavily from the island’s rum heritage and maritime folklore.'
    },
    'Hendrick’s': {
      title: 'An eccentric approach to gin.',
      story: 'Hendrick’s takes a deliberately unconventional route to gin, combining a botanical foundation with the distinctive influence of rose and cucumber. The result is floral, fresh and unmistakably different from a traditional London-style profile.',
      history: 'Hendrick’s was introduced in Scotland in the late 1990s and became known for pairing traditional gin distillation with an unusually expressive botanical recipe and a distinctive apothecary-inspired identity.'
    },
    'Appleton Estate V/X': {
      title: 'Jamaican rum with estate heritage.',
      story: 'Appleton Estate V/X reflects Jamaica’s deep rum-making tradition, bringing together rounded molasses character, warm spice and tropical fruit notes. Its style is generous and approachable while retaining the depth associated with aged Jamaican rum.',
      history: 'Appleton Estate traces its roots to Jamaica’s Nassau Valley, where rum has been produced for centuries. The estate’s heritage is closely tied to Jamaican sugarcane, local fermentation and the island’s distinctive pot-still tradition.'
    }
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
      history: 'Its story is rooted in the traditions, ingredients and craft that define its category.'
    }

    content.innerHTML = `
      <div class="detail-scroll-spacer"></div>
      <div class="detail-scroll-section">
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
      <div class="detail-scroll-section">
        <div class="detail-scroll-inner detail-scroll-story">
          <h3>Heritage</h3>
          <div>
            <p>${story.history}</p>
            <p>The details of the bottle — its style, origin and production character — are part of what makes this expression distinct within the collection.</p>
          </div>
        </div>
      </div>
      <div class="detail-scroll-section detail-scroll-end">
        <div>
          <p>END OF EDITION</p>
          <h3>${name}</h3>
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

  function setScrolledState(view) {
    const showcase = document.querySelector('.showcase')
    if (!showcase) return
    showcase.classList.toggle('detail-scrolled', view.scrollTop > 80)
  }

  function resetScroll(view) {
    view.scrollTop = 0
    const showcase = document.querySelector('.showcase')
    showcase?.classList.remove('detail-scrolled')
    requestAnimationFrame(() => {
      view.scrollTop = 0
      showcase?.classList.remove('detail-scrolled')
    })
  }

  function init(view) {
    if (!view || view.dataset.scrollReady === 'true') return
    view.dataset.scrollReady = 'true'

    // The detail page owns the wheel interaction while it is open.
    view.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true })
    view.addEventListener('scroll', () => setScrolledState(view), { passive: true })

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
