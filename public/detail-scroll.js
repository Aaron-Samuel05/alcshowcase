(() => {
  const histories = {
    'New Amsterdam': { title: 'A modern New York spirit.', story: 'New Amsterdam is built around a clean, approachable vodka style with a distinctly contemporary New York identity. Its name reaches back to the Dutch settlement that became New York City.', history: 'The visual story now follows New York back to its earliest identity: the waterfront settlement of New Amsterdam, its Dutch roots and the city that grew from it.', craft: 'A contemporary spirit framed by an older city — where the past and present meet in one unmistakably New York identity.', images: [
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/GezichtOpNieuwAmsterdam.jpg', alt: 'New Amsterdam in 1664, archival view', label: 'NEW AMSTERDAM / 1664' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Plan_of_New_York_or_New_Amsterdam_%28as_in_Sept_1661%29%2C_1664_-_BL.jpg', alt: 'Plan of New Amsterdam from 1664', label: 'NEW AMSTERDAM / CITY PLAN' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Fort_New_Amsterdam_on_the_Manhatans_%28New_York%29_print_c1626.jpg', alt: 'Early view of Fort New Amsterdam on Manhattan', label: 'FORT AMSTERDAM / C.1626' }
    ] },
    'Captain Morgan': { title: 'Born from Caribbean rum culture.', story: 'Captain Morgan is named for Sir Henry Morgan, the Welsh privateer who became Lieutenant Governor of Jamaica. The brand draws on the mythology, maritime history and rum culture of the Caribbean.', history: 'This story begins with the man behind the name and the Caribbean world in which he lived — old maps, portraits, ports and the island of Jamaica.', craft: 'Warm spice, caramel and dark rum character are presented through a visual language rooted in Caribbean history rather than modern cocktail photography.', images: [
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Admiral_Sir_Henry_Morgan_%281635%E2%80%931688%29%2C_Lieutenant_Governor_of_Jamaica.jpg', alt: 'Portrait of Sir Henry Morgan, Lieutenant Governor of Jamaica', label: 'SIR HENRY MORGAN / PORTRAIT' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Port_Royal%2C_Jamaica%2C_in_the_17th_century%2C_before_the_devastating_earthquake_in_1692.jpg', alt: 'Port Royal Jamaica in the seventeenth century', label: 'PORT ROYAL / 17TH CENTURY' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/View_of_Port_Royal_and_Kingston_Harbour_in_the_Island_ofJamaica_%28NYPL_Hades-287497-EM3961%29.jpg', alt: 'Historical view of Port Royal and Kingston Harbour', label: 'JAMAICA / PORT ROYAL' }
    ] },
    'Hendrick’s': { title: 'An eccentric approach to gin.', story: 'Hendrick’s takes a deliberately unconventional route to gin, combining traditional distillation with rose, cucumber and two remarkable antique stills.', history: 'Its production story is tied to Girvan, Scotland, and to the rare Bennett still dating from 1860 and Carter-Head still dating from 1948 that helped define the spirit’s unusual character.', craft: 'Old copper, small-batch distillation and an eccentric botanical recipe form the bridge between Victorian distilling equipment and a modern Scottish gin.', images: [
      { url: 'https://www.livetsgoda.se/uploads/2019/01/The%20Girvan%20Patent%20Still%20Distillery%20Welcome%20Sign_original.jpg', alt: 'Girvan distillery in Scotland', label: 'GIRVAN / SCOTLAND' },
      { url: 'https://images.ctfassets.net/a2epoeqa068n/I0nSS3eh9ZxXRRmMYmrJT/6c2c223f61ab0a2611561a6ede43be79/DSC_5261_Large.jpeg', alt: 'The historic Bennett still from 1860', label: 'BENNETT STILL / 1860' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Girvan%2C_Scotland%2C_1890s.jpg', alt: 'Girvan Scotland in the 1890s', label: 'GIRVAN / 1890s' }
    ] },
    'Appleton Estate V/X': { title: 'Jamaican rum with estate heritage.', story: 'Appleton Estate V/X reflects Jamaica’s deep rum-making tradition, rooted in the Nassau Valley and a production story stretching back to the first recorded distillation in 1749.', history: 'The story moves from Jamaican cane fields and the Nassau Valley into the old Appleton factory, where fermentation, pot stills and oak aging became part of the estate’s identity.', craft: 'Jamaica’s landscape, sugarcane and traditional pot-still production shape the character of the rum — a process worth seeing, not just reading about.', images: [
      { url: 'https://substackcdn.com/image/fetch/$s_%21VnoO%21%2Cf_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8affe6e5-9145-4087-8345-334e52912e38_1200x955.jpeg', alt: 'Appleton Estate distillery operations in 1950', label: 'APPLETON ESTATE / 1950' },
      { url: 'https://www.lavanguardia.com/files/og_thumbnail/uploads/2021/08/03/61098397068df.jpeg', alt: 'Historical Jamaican sugar cane workers', label: 'JAMAICA / SUGAR CANE' },
      { url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Appleton_Estate_Jamaica_November_2012.jpg', alt: 'Appleton Estate rum factory in Jamaica', label: 'APPLETON FACTORY / JAMAICA' }
    ] }
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
    const story = histories[name] || { title: `The character of ${name}.`, story: `A carefully composed ${category.toLowerCase()} selected for its distinctive character, balance and place within the collection.`, history: 'Its story is rooted in the traditions, ingredients and craft that define its category.', craft: 'Its production character is part of what gives this expression its place within the collection.', images: [{ url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1800&q=85', alt: 'Atmospheric spirits still life', label: 'THE COLLECTION' }] }
    const image = (index) => story.images[index % story.images.length]
    const a = image(0), b = image(1), c = image(2)
    content.innerHTML = `<div class="detail-scroll-spacer"></div><section class="detail-scroll-section detail-scroll-story-section"><div class="detail-scroll-inner detail-scroll-story-layout"><div class="detail-scroll-story-copy"><p class="detail-scroll-kicker">01 / THE STORY</p><h3 class="detail-scroll-title">${story.title}</h3><p class="detail-scroll-copy">${story.story}</p><div class="detail-scroll-origin"><span>ORIGIN</span><strong>${facts[1] || 'SELECTED ORIGIN'}</strong></div></div><figure class="detail-scroll-visual detail-scroll-visual-story"><img src="${a.url}" alt="${a.alt}" loading="lazy" /><figcaption><span>${a.label}</span><i></i></figcaption></figure></div></section><section class="detail-scroll-section detail-scroll-heritage-section"><div class="detail-scroll-inner detail-scroll-heritage-layout"><figure class="detail-scroll-visual detail-scroll-visual-heritage"><img src="${b.url}" alt="${b.alt}" loading="lazy" /><figcaption><span>${b.label}</span><i></i></figcaption></figure><div class="detail-scroll-story-copy detail-scroll-heritage-copy"><p class="detail-scroll-kicker">02 / HERITAGE</p><h3>Where the story begins.</h3><p class="detail-scroll-lead">${story.history}</p><p>${story.craft}</p><div class="detail-scroll-callout"><span>ARCHIVE</span><strong>${b.label}</strong></div></div></div></section><section class="detail-scroll-section detail-scroll-character-section"><div class="detail-scroll-character-image" style="background-image:url('${c.url}')"></div><div class="detail-scroll-character-overlay"></div><div class="detail-scroll-inner detail-scroll-character-content"><p class="detail-scroll-kicker">03 / CHARACTER</p><div class="detail-scroll-character-row"><h3>${name}</h3><div><span>STYLE</span><strong>${facts[0] || 'SIGNATURE STYLE'}</strong><span>ORIGIN</span><strong>${facts[1] || 'SELECTED ORIGIN'}</strong><span>CATEGORY</span><strong>${category}</strong></div></div></div></section><section class="detail-scroll-section detail-scroll-end"><div><p>END OF EDITION</p><h3>${name}</h3><div class="detail-scroll-end-meta"><span>${category}</span><span>${facts[1] || 'SELECTED ORIGIN'}</span><span>${facts[0] || 'SIGNATURE STYLE'}</span></div></div></section>`
    if (!view.querySelector('.detail-scroll-hint')) { const hint = document.createElement('div'); hint.className = 'detail-scroll-hint'; hint.innerHTML = 'SCROLL TO DISCOVER<span>↓</span>'; view.appendChild(hint) }
  }

  function updateHeroScroll(view) {
    const showcase = document.querySelector('.showcase'), copy = view.querySelector('.detail-copy')
    if (!showcase || !copy) return
    const hero = document.querySelector('.showcase.is-detail .bottle[data-bottle-active="true"]')
    // Give the opening scene a slower, deliberate exit: 0 -> 100% over ~42% of a viewport.
    const progress = clamp01(view.scrollTop / Math.max(1, window.innerHeight * 0.9))
    const fadeProgress = clamp01(progress / 0.42)
    const fade = 1 - smoothstep(fadeProgress)
    const lift = smoothstep(fadeProgress)
    copy.style.setProperty('--scroll-x', `${-18 * lift}px`)
    copy.style.setProperty('--scroll-y', `${-18 * lift}px`)
    copy.style.setProperty('--scroll-scale', `${1 - lift * 0.025}`)
    copy.style.opacity = String(fade)
    if (hero) {
      hero.style.setProperty('--detail-hero-opacity', String(fade))
      hero.style.visibility = fade <= 0.01 ? 'hidden' : 'visible'
    }
    showcase.classList.toggle('detail-archive-active', fade <= 0.01)
    showcase.classList.toggle('detail-scrolled', progress > 0.02)
  }

  function resetScroll(view) {
    view.scrollTop = 0
    const showcase = document.querySelector('.showcase'), copy = view.querySelector('.detail-copy')
    showcase?.classList.remove('detail-scrolled', 'detail-archive-active')
    if (copy) { copy.style.setProperty('--scroll-x','0px'); copy.style.setProperty('--scroll-y','0px'); copy.style.setProperty('--scroll-scale','1'); copy.style.opacity='' }
    const hero = document.querySelector('.showcase.is-detail .bottle[data-bottle-active="true"]')
    if (hero) { hero.style.setProperty('--detail-hero-opacity','1'); hero.style.visibility='visible' }
    requestAnimationFrame(() => updateHeroScroll(view))
  }

  function init(view) {
    if (!view || view.dataset.scrollReady === 'true') return
    view.dataset.scrollReady='true'
    view.addEventListener('wheel', (event) => event.stopPropagation(), { passive:true })
    view.addEventListener('scroll', () => updateHeroScroll(view), { passive:true })
    window.addEventListener('resize', () => { if (view.getAttribute('aria-hidden') === 'false') updateHeroScroll(view) }, { passive:true })
    const observer = new MutationObserver(() => { const isOpen = view.getAttribute('aria-hidden') === 'false'; buildDetails(view); if (isOpen) resetScroll(view) })
    observer.observe(view, { attributes:true, attributeFilter:['aria-hidden'] })
    buildDetails(view)
    if (view.getAttribute('aria-hidden') === 'false') resetScroll(view)
  }
  const boot = () => { const view = document.querySelector('.detail-view'); if (view) init(view) }
  new MutationObserver(boot).observe(document.body, { childList:true, subtree:true })
  boot()
})()
