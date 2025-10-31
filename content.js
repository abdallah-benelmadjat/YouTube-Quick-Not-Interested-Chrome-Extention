// Dismissal reason preference
let preferredReason = 'first';

function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

const NOT_INTERESTED_VARIANTS = [
  'not interested',
  'не интересует',
];

const DONT_RECOMMEND_VARIANTS = [
  "don't recommend channel",
  "don't recommend this channel",
  'не рекомендовать видео с этого канала',
  'не рекомендовать этот канал',
];

const VIDEO_ANCHOR_SELECTORS = [
  'a.yt-lockup-view-model__content-image',
  'ytd-rich-item-renderer a#thumbnail',
  'ytd-video-renderer a#thumbnail',
  'ytd-grid-video-renderer a#thumbnail',
  'ytd-playlist-panel-video-renderer a#thumbnail',
  'ytd-compact-video-renderer a#thumbnail',
  'ytd-compact-radio-renderer a#thumbnail',
  'ytd-compact-playlist-renderer a#thumbnail',
  'ytd-compact-autoplay-renderer a#thumbnail',
];

const VIDEO_CONTAINER_SELECTORS = [
  'ytd-rich-item-renderer',
  'ytd-grid-video-renderer',
  'ytd-video-renderer',
  'ytd-playlist-panel-video-renderer',
  'ytd-compact-video-renderer',
  'ytd-compact-radio-renderer',
  'ytd-compact-playlist-renderer',
  'ytd-compact-autoplay-renderer',
  'yt-lockup-view-model',
  '.yt-lockup-view-model',
  '.yt-lockup-view-model--wrapper',
  '.style-scope.ytd-item-section-renderer',
];

const SPRITE_ELEMENT_ID = 'nqi-action-sprite';
const NOT_INTERESTED_SYMBOL_ID = 'nqi-icon-not-interested';
const DONT_RECOMMEND_SYMBOL_ID = 'nqi-icon-dont-recommend';
const SPRITE_MARKUP = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false" id="${SPRITE_ELEMENT_ID}">
  <symbol id="${NOT_INTERESTED_SYMBOL_ID}" viewBox="0 0 24 24">
    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 018.246 12.605L4.755 6.661A8.99 8.99 0 0112 3ZM3.754 8.393l15.491 8.944A9 9 0 013.754 8.393Z"></path>
  </symbol>
  <symbol id="${DONT_RECOMMEND_SYMBOL_ID}" viewBox="0 0 24 24">
    <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Zm0 2a9 9 0 110 18.001A9 9 0 0112 3Zm4 8H8a1 1 0 000 2h8a1 1 0 000-2Z"></path>
  </symbol>
</svg>
`.trim();

function ensureSpriteInjected() {
  if (document.getElementById(SPRITE_ELEMENT_ID)) return;
  const container = document.createElement('div');
  container.innerHTML = SPRITE_MARKUP;
  const svg = container.firstElementChild;
  if (svg) {
    document.body.appendChild(svg);
  }
}

function createIconElement(symbolId) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('notinterested-btn__icon');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${symbolId}`);
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${symbolId}`);
  svg.appendChild(use);

  return svg;
}

function createActionButton(wrapper, modifierClass, title, symbolId, onClick) {
  const btn = document.createElement('button');
  btn.className = `notinterested-btn ${modifierClass}`;
  btn.title = title;
  btn.appendChild(createIconElement(symbolId));
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  });
  wrapper.appendChild(btn);
  return btn;
}

function addButton(anchor) {
  if (!anchor || !anchor.parentElement) return;

  ensureSpriteInjected();

  let wrapper = anchor.closest('.notinterested-wrapper');

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'notinterested-wrapper';
    anchor.parentElement.insertBefore(wrapper, anchor);
    wrapper.appendChild(anchor);
  }

  if (!wrapper.querySelector('.notinterested-btn--primary')) {
    createActionButton(
      wrapper,
      'notinterested-btn--primary',
      'Not Interested',
      NOT_INTERESTED_SYMBOL_ID,
      () => handleNotInterested(anchor),
    );
  }

  if (!wrapper.querySelector('.notinterested-btn--secondary')) {
    createActionButton(
      wrapper,
      'notinterested-btn--secondary',
      "Don't recommend channel",
      DONT_RECOMMEND_SYMBOL_ID,
      () => handleDontRecommend(anchor),
    );
  }
}

function getVideoContainer(anchor) {
  if (!anchor) return null;
  for (const selector of VIDEO_CONTAINER_SELECTORS) {
    const container = anchor.closest(selector);
    if (container && container !== anchor) {
      return container;
    }
  }

  const fallback = anchor.closest('[class*="lockup"]');
  if (fallback && fallback !== anchor) {
    return fallback;
  }

  const parent = anchor.parentElement;
  if (!parent) return null;

  for (const selector of VIDEO_CONTAINER_SELECTORS) {
    const container = parent.closest(selector);
    if (container && container !== anchor) {
      return container;
    }
  }

  return parent.parentElement || parent;
}

function getMenuButton(videoContainer) {
  if (!videoContainer) return null;
  return videoContainer.querySelector('.yt-lockup-metadata-view-model__menu-button button') ||
    videoContainer.querySelector('#menu button') ||
    videoContainer.querySelector('ytd-menu-renderer button') ||
    videoContainer.querySelector('button[aria-label="More actions"], button[aria-label="More options"], button[aria-label="More"], button[aria-label="Options"], button[aria-label="Menu"], button[aria-label="Ещё"]');
}

function openVideoMenu(anchor) {
  const videoContainer = getVideoContainer(anchor);
  console.log('videoContainer:', videoContainer);
  const menuBtn = getMenuButton(videoContainer);
  console.log('menuBtn:', menuBtn);

  if (!menuBtn) {
    console.log('No menu button found');
    return null;
  }

  menuBtn.click();
  console.log('Menu button clicked');
  return menuBtn;
}

function handleNotInterested(anchor) {
  const menuBtn = openVideoMenu(anchor);
  if (!menuBtn) return;

  setTimeout(() => {
    const menuItem = findMenuItem(NOT_INTERESTED_VARIANTS);
    console.log('notInterestedItem:', menuItem);
    if (!menuItem) {
      console.log('No not interested item found');
      return;
    }

    menuItem.click();
    console.log('Not interested item clicked');

    setTimeout(() => {
      const reasonElement = findDismissalReason();
      console.log('reasonElement:', reasonElement);
      if (!reasonElement) {
        console.log('No dismissal reason found');
        return;
      }

      reasonElement.click();
      console.log('Reason selected');

      setTimeout(() => {
        const submitBtn = findSubmitButton();
        console.log('submitBtn:', submitBtn);
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
          console.log('Submit clicked');
          setTimeout(() => {
            if (menuBtn && document.contains(menuBtn)) {
              menuBtn.click();
              console.log('Menu closed');
            }
          }, 300);
        } else {
          console.log('Submit button not found or disabled');
        }
      }, 100);
    }, 300);
  }, 300);
}

function handleDontRecommend(anchor) {
  const menuBtn = openVideoMenu(anchor);
  if (!menuBtn) return;

  setTimeout(() => {
    const menuItem = findMenuItem(DONT_RECOMMEND_VARIANTS);
    console.log('dontRecommendItem:', menuItem);
    if (!menuItem) {
      console.log("No don't recommend item found");
      return;
    }

    menuItem.click();
    console.log("Don't recommend item clicked");
  }, 300);
}

function findCancelButton() {
  const buttons = document.querySelectorAll('button.yt-spec-button-shape-next');
  for (const btn of buttons) {
    const textElement = btn.querySelector('.yt-spec-button-shape-next__text span, .yt-core-attributed-string');
    if (textElement && textElement.textContent.trim() === 'Cancel') {
      return btn;
    }
  }
  return null;
}

function findDismissalReason() {
  const reasons = document.querySelectorAll('.dismissal-view-style-compact-tall .yt-core-attributed-string');
  let selectedReason = null;
  if (preferredReason === 'first') {
    selectedReason = reasons.length > 0 ? reasons[0] : null;
  } else if (preferredReason === 'watched') {
    selectedReason = Array.from(reasons).find((r) => r.textContent.trim() === "I've already watched the video");
    if (!selectedReason) selectedReason = reasons[0];
  } else if (preferredReason === 'dont_like') {
    selectedReason = Array.from(reasons).find((r) => r.textContent.trim() === "I don't like the video");
    if (!selectedReason) selectedReason = reasons[0];
  }
  if (selectedReason) {
    return selectedReason.closest('[role="radio"], [tabindex]');
  }
  return null;
}

function findSubmitButton() {
  const buttons = document.querySelectorAll('button.yt-spec-button-shape-next');
  for (const btn of buttons) {
    const textElement = btn.querySelector('.yt-spec-button-shape-next__text span, .yt-core-attributed-string');
    if (textElement && (textElement.textContent.trim() === 'Submit' || textElement.textContent.trim() === 'Submit feedback')) {
      return btn;
    }
  }
  return null;
}

function findMenuItem(variants) {
  const menuSelector = 'tp-yt-iron-dropdown:not([aria-hidden="true"]) yt-list-item-view-model[role="menuitem"]';
  const items = document.querySelectorAll(menuSelector);
  const normalizedVariants = variants.map(normalizeText);
  console.log('yt-list-item-view-model items found:', items.length);
  for (const item of items) {
    const titleSpan = item.querySelector('.yt-core-attributed-string');
    const text = normalizeText(titleSpan ? titleSpan.textContent : '');
    console.log('Item text:', text || 'No title span');
    if (titleSpan && normalizedVariants.includes(text)) {
      return item;
    }
  }
  return null;
}

function addButtonsToVideos() {
  VIDEO_ANCHOR_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach(addButton);
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        VIDEO_ANCHOR_SELECTORS.forEach((selector) => {
          if (node.matches(selector)) {
            addButton(node);
          }
          node.querySelectorAll(selector).forEach(addButton);
        });
      }
    });
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  chrome.storage.sync.get(['dismissalReason'], (result) => {
    preferredReason = result.dismissalReason || 'first';
    console.log('Loaded preferred reason:', preferredReason);
  });

  ensureSpriteInjected();
  addButtonsToVideos();
  observer.observe(document.body, {childList: true, subtree: true});
}
