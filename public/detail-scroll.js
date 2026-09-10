(() => {
  const histories = {
    'New Amsterdam': {
      title: 'A modern New York spirit.',
      story: 'New Amsterdam is built around a clean, approachable vodka style with a distinctly contemporary New York identity. Its name reaches back to the Dutch settlement that became New York City.',
      history: 'The visual story now follows New York back to its earliest identity: the waterfront settlement of New Amsterdam, its Dutch roots and the city that grew from it.',
      craft: 'A contemporary spirit framed by an older city — where the past and present meet in one unmistakably New York identity.',
      images: [
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/GezichtOpNieuwAmsterdam.jpg', alt: 'New Amsterdam in 1664, archival view', label: 'NEW AMSTERDAM / 1664' },
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/AMH-6740-NA_View_of_New_Amsterdam.jpg', alt: 'Archival view of New Amsterdam', label: 'ARCHIVE / NEW AMSTERDAM' },
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/GezichtOpNieuwAmsterdam.jpg', alt: 'Historical New Amsterdam skyline', label: 'NEW YORK / ORIGINS' }
      ]
    },
    'Captain Morgan': {
      title: 'Born from Caribbean rum culture.',
      story: 'Captain Morgan is named for Sir Henry Morgan, the Welsh privateer who became Lieutenant Governor of Jamaica. The brand draws on the mythology, maritime history and rum culture of the Caribbean.',
      history: 'This story begins with the man behind the name and the Caribbean world in which he lived — old maps, portraits, ports and the island of Jamaica.',
      craft: 'Warm spice, caramel and dark rum character are presented through a visual language rooted in Caribbean history rather than modern cocktail photography.',
      images: [
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sir_Henry_Morgan_%281635-1688%29_%28imp-cswc-GB-237-CSWC47-LS11-008%29.jpg', alt: 'Archival portrait of Sir Henry Morgan', label: 'SIR HENRY MORGAN / ARCHIVE' },
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sir_Henry_Morgan_%281635-1688%29_%28imp-cswc-GB-237-CSWC47-LS11-008%29.jpg', alt: 'Historical portrait associated with Captain Morgan', label: 'CARIBBEAN / 17TH CENTURY' },
        { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sir_Henry_Morgan_%281635-1688%29_%28imp-cswc-GB-237-CSWC47-LS11-008%29.jpg', alt: 'Sir Henry Morgan archival portrait', label: 'THE MAN BEHIND THE NAME' }
      ]
    },
    'Hendrick’s': {
      title: 'An eccentric approach to gin.',
      story: 'Hendrick’s takes a deliberately unconventional route to gin, combining traditional distillation with rose, cucumber and two remarkable antique stills.',
      history: 'Its production story is tied to Girvan, Scotland, and to the rare Bennett still dating from 1860 and Carter-Head still dating from 1948 that helped define the spirit’s unusual character.',
      craft: 'Old copper, small-batch distillation and an eccentric botanical recipe form the bridge between Victorian distilling equipment and a modern Scottish gin.',
      images: [
        { url: 'https://www.livetsgoda.se/uploads/2019/01/The%20Girvan%20Patent%20Still%20Distillery%20Welcome%20Sign_original.jpg', alt: 'Girvan Distillery entrance in monochrome', label: 'GIRVAN / SCOTLAND' },
        { url: 'https://images.ctfassets.net/a2epoeqa068n/I0nSS3eh9ZxXRRmMYmrJT/6c2c223f61ab0a2611561a6ede43be79/DSC_5261_Large.jpeg', alt: 'The historic Bennett still from 1860', label: 'BENNETT STILL / 1860' },
        { url: 'https://www.livetsgoda.se/uploads/2019/01/The%20Girvan%20Patent%20Still%20Distillery%20Welcome%20Sign_original.jpg', alt: 'Girvan Scotland archival-style image', label: 'SCOTLAND / DISTILLING' }
      ]
    },
    'Appleton Estate V/X': {
      title: 'Jamaican rum with estate heritage.',
      story: 'Appleton Estate V/X reflects Jamaica’s deep rum-making tradition, rooted in the Nassau Valley and a production story stretching back to the first recorded distillation in 1749.',
      history: 'The story moves from Jamaican cane fields and the Nassau Valley into the old Appleton factory, where fermentation, pot stills and oak aging became part of the estate’s identity.',
      craft: 'Jamaica’s landscape, sugarcane and traditional pot-still production shape the character of the rum — a process worth seeing, not just reading about.',
      images: [
        { url: 'https://substackcdn.com/image/fetch/$s_%21VnoO%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8affe6e5-9145-4087-8345-334e52912e38_1200x955.jpeg', alt: 'Appleton Estate distillery operations in 1950', label: 'APPLETON ESTATE / 1950' },
        { url: 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2021/08/03/61098397068df.jpeg', alt: 'Historical Jamaican sugar cane workers', label: 'JAMAICA / SUGAR CANE' },
        { url: 'https://substackcdn.com/image/fetch/$s_%21VnoO%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8affe6e5-9145-4087-8345-334e52912e38_1200x955.jpeg', alt: 'Archival Appleton Estate distillery', label: 'NASSAU VALLEY / RUM MAKING' }
      ]
    }
  }

  const clamp01 = (value) => Math.max(0, Math.min(1, value))
  const smoothstep = (value) => { const t = clamp01(value); return t * t * (3 - 2 * t) }

  function buildDetails(view) {
    if (!view) return
    let content = view.querySelector('.detail-scroll-content')
    if (!content) { content = document.createElement('div'); content.className = 'detail-scroll-content'; view.appendChild(content) }

    const name = view.querySelector('.detail-copy h2')?.textContent?.trim() || 'Selected Bottle'
    const category = view.querySelector('.detail-copy .eyebrow')?.textContent?.trim() || ''
    const facts = [...view.querySelectorAll('.detail-copy dl dd')].map((el) => el.textContent.trim())
    const story = histories[name] || {
      title: `The character of ${name}.`, story: `A carefully composed ${category.toLowerCase()} selected for its distinctive character, balance and place within the collection.`,
      history: 'Its story is rooted in the traditions, ingredients and craft that define its category.', craft: 'Its production character is part of what gives this expression its place within the collection.',
      images: [{ url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1800&q=85', alt: 'Atmospheric spirits still life', label: 'THE COLLECTION' }]
    }
    const image = (index) => story.images[index % story.images.length]
    const a = image(0), b = image(1), c = image(2)

    content.innerHTML = `
      <div class="detail-scroll-spacer"></div>
      <section class="detail-scroll-section detail-scroll-story-section">
        <div class="detail-scroll-inner detail-scroll-story-layout">
          <div class="detail-scroll-story-copy">
            <p class="detail-scroll-kicker">01 / THE STORY</p>
            <h3 class="detail-scroll-title">${story.title}</h3>
            <p class="detail-scroll-copy">${story.story}</p>
            <div class="detail-scroll-origin"><span>ORIGIN</span><strong>${facts[1] || 'SELECTED ORIGIN'}</strong></div>
          </div>
          <figure class="detail-scroll-visual detail-scroll-visual-story">
            <img src="${a.url}" alt="${a.alt}" loading="lazy" />
            <figcaption><span>${a.label}</span><i></i></figcaption>
          </figure>
        </div>
      </section>
      <section class="detail-scroll-section detail-scroll-heritage-section">
        <div class="detail-scroll-inner detail-scroll-heritage-layout">
          <figure class="detail-scroll-visual detail-scroll-visual-heritage">
            <img src="${b.url}" alt="${b.alt}" loading="lazy" />
            <figcaption><span>${b.label}</span><i></i></figcaption>
          </figure>
          <div class="detail-scroll-story-copy detail-scroll-heritage-copy">
            <p class="detail-scroll-kicker">02 / HERITAGE</p>
            <h3>Where the story begins.</h3>
            <p class="detail-scroll-lead">${story.history}</p>
            <p>${story.craft}</p>
            <div class="detail-scroll-callout"><span>ARCHIVE</span><strong>${b.label}</strong></div>
          </div>
        </div>
      </section>
      <section class="detail-scroll-section detail-scroll-character-section">
        <div class="detail-scroll-character-image" style="background-image:url('${c.url}')"></div>
        <div class="detail-scroll-character-overlay"></div>
        <div class="detail-scroll-inner detail-scroll-character-content">
          <p class="detail-scroll-kicker">03 / CHARACTER</p>
          <div class="detail-scroll-character-row">
            <h3>${name}</h3>
            <div><span>STYLE</span><strong>${facts[0] || 'SIGNATURE STYLE'}</strong><span>ORIGIN</span><strong>${facts[1] || 'SELECTED ORIGIN'}</strong><span>CATEGORY</span><strong>${category}</strong></div>
          </div>
        </div>
      </section>
      <section class="detail-scroll-section detail-scroll-end">
        <div><p>END OF EDITION</p><h3>${name}</h3><div class="detail-scroll-end-meta"><span>${category}</span><span>${facts[1] || 'SELECTED ORIGIN'}</span><span>${facts[0] || 'SIGNATURE STYLE'}</span></div></div>
      </section>
    `

    if (!view.querySelector('.detail-scroll-hint')) { const hint = document.createElement('div'); hint.className = 'detail-scroll-hint'; hint.innerHTML = 'SCROLL TO DISCOVER<span>↓</span>'; view.appendChild(hint) }
  }

  function captureHeroGeometry(view) { const copy = view.querySelector('.detail-copy'); if (!copy) return; const rect = copy.getBoundingClientRect(); view.dataset.heroShift = String((window.innerWidth / 2) - (rect.left + rect.width / 2)) }

  function updateHeroScroll(view) {
    const showcase = document.querySelector('.showcase'), copy = view.querySelector('.detail-copy'); if (!showcase || !copy) return
    if (!view.dataset.heroShift) captureHeroGeometry(view)
    const progress = clamp01(view.scrollTop / Math.max(1, window.innerHeight * 0.82)), eased = smoothstep(progress), heroShift = Number.parseFloat(view.dataset.heroShift || '0')
    copy.style.setProperty('--scroll-x', `${heroShift * eased}px`); copy.style.setProperty('--scroll-y', `${-8 * eased}px`); copy.style.setProperty('--scroll-scale', `${1 - eased * 0.035}`)
    const bottleProgress = smoothstep(progress / 0.9), bottleOpacity = 1 - bottleProgress
    document.querySelectorAll('.showcase.is-detail .bottle').forEach((bottle) => { if (Number.parseInt(getComputedStyle(bottle).zIndex || '0', 10) >= 50) { bottle.style.opacity = String(bottleOpacity); bottle.style.filter = `drop-shadow(0 28px 22px rgba(0,0,0,.36)) blur(${bottleProgress * 4}px)` } })
    copy.style.opacity = String(1 - smoothstep((progress - 0.72) / 0.28) * 0.9); showcase.classList.toggle('detail-scrolled', progress > 0.04)
    const scrollRatio = clamp01(view.scrollTop / Math.max(1, view.scrollHeight - window.innerHeight))
    view.querySelectorAll('.detail-scroll-visual img').forEach((img, index) => { const local = smoothstep(clamp01((scrollRatio * 4.5) - index * 0.55)); img.style.transform = `scale(${1.08 - local * 0.035}) translate3d(0, ${12 - local * 12}%, 0)` })
    view.querySelectorAll('.detail-scroll-character-image').forEach((image) => { image.style.transform = `scale(1.08) translate3d(0, ${scrollRatio * -5}%, 0)` })
  }

  function resetScroll(view) {
    view.scrollTop = 0; const showcase = document.querySelector('.showcase'), copy = view.querySelector('.detail-copy'); showcase?.classList.remove('detail-scrolled')
    if (copy) { copy.style.setProperty('--scroll-x','0px'); copy.style.setProperty('--scroll-y','0px'); copy.style.setProperty('--scroll-scale','1'); copy.style.opacity='' }
    delete view.dataset.heroShift; document.querySelectorAll('.showcase .bottle').forEach((bottle) => { bottle.style.opacity=''; bottle.style.filter='' })
    requestAnimationFrame(() => { view.scrollTop=0; captureHeroGeometry(view); showcase?.classList.remove('detail-scrolled'); updateHeroScroll(view) })
  }

  function init(view) {
    if (!view || view.dataset.scrollReady === 'true') return; view.dataset.scrollReady='true'
    view.addEventListener('wheel', (event) => event.stopPropagation(), { passive:true }); view.addEventListener('scroll', () => updateHeroScroll(view), { passive:true })
    window.addEventListener('resize', () => { if (view.getAttribute('aria-hidden') === 'false') { captureHeroGeometry(view); updateHeroScroll(view) } }, { passive:true })
    const observer = new MutationObserver(() => { const isOpen = view.getAttribute('aria-hidden') === 'false'; buildDetails(view); if (isOpen) resetScroll(view) })
    observer.observe(view, { attributes:true, attributeFilter:['aria-hidden'] }); buildDetails(view); if (view.getAttribute('aria-hidden') === 'false') resetScroll(view)
  }
  const boot = () => { const view = document.querySelector('.detail-view'); if (view) init(view) }
  new MutationObserver(boot).observe(document.body, { childList:true, subtree:true }); boot()
})()
