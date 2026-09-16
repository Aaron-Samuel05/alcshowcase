(() => {
  const content = {
    'Old Town Whiskey': {
      title: 'A smooth, timeless classic.',
      story: 'Old Town Whiskey is one of the named brands in the NTS Blenders and Distillers portfolio, positioned as a smooth, timeless classic.',
      heritage: 'NTS Blenders and Distillers is an Indian alcobev company with a portfolio spanning whisky, rum, brandy and vodka.',
      craft: 'The brand sits within NTS’s wider spirits collection, alongside the East Coast and Zipper ranges.'
    },
    'East Coast Whisky': {
      title: 'Rich. Full-bodied. East Coast.',
      story: 'East Coast is an NTS brand spanning whisky, rum and brandy, described by the company as a range of rich, full-bodied blends.',
      heritage: 'The East Coast range is part of NTS Blenders and Distillers’ growing Indian-made spirits portfolio.',
      craft: 'The portfolio brings together whisky, rum and brandy expressions under one East Coast identity.'
    },
    'East Coast Rum': {
      title: 'A full-bodied expression from East Coast.',
      story: 'East Coast Rum belongs to the East Coast range from NTS Blenders and Distillers, a portfolio that spans whisky, rum and brandy.',
      heritage: 'NTS presents East Coast as a rich, full-bodied range within its broader spirits portfolio.',
      craft: 'The rum expression carries the East Coast identity while sitting alongside the range’s whisky and brandy offerings.'
    },
    'Zipper Vodka': {
      title: 'Vodka with a flavour-forward edge.',
      story: 'Zipper Vodka is an NTS brand available in a plain expression and refreshing flavours including Green Apple, Orange, Lemon and Guava.',
      heritage: 'Zipper is part of NTS Blenders and Distillers’ portfolio of Indian-made spirits across vodka, whisky, rum and brandy.',
      craft: 'The range combines a straightforward plain vodka with a selection of fruit-led flavour variants.'
    }
  }

  let observer
  let scheduled = false

  const setText = (element, value) => {
    if (element && element.textContent !== value) element.textContent = value
  }

  const apply = () => {
    scheduled = false
    const view = document.querySelector('.detail-view')
    if (!view || view.getAttribute('aria-hidden') !== 'false') return

    const name = (view.getAttribute('aria-label') || '').replace(/\s+details\s*$/i, '').trim()
    const item = content[name]
    if (!item) return

    const title = view.querySelector('.detail-scroll-title')
    const copy = view.querySelector('.detail-scroll-copy')
    const heritageTitle = [...view.querySelectorAll('h3')].find((el) => el.textContent.trim() === 'Where the story begins.')
    const heritageParagraphs = heritageTitle?.parentElement?.querySelectorAll('p') || []

    // Prevent our own text updates from triggering a MutationObserver feedback loop.
    observer?.disconnect()
    try {
      setText(title, item.title)
      setText(copy, item.story)
      setText(heritageParagraphs[0], item.heritage)
      setText(heritageParagraphs[1], item.craft)
    } finally {
      observer?.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-hidden'] })
    }
  }

  const scheduleApply = () => {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(apply)
  }

  observer = new MutationObserver(scheduleApply)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-hidden']
  })

  requestAnimationFrame(apply)
})()
