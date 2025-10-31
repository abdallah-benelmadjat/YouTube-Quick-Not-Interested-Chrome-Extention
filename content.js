// Dismissal reason preference
let preferredReason = 'first';

function normalizeText(text) {
  return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

const NOT_INTERESTED_VARIANTS = [
  'not interested',
  'не интересует',
];

// Function to add button to a video thumbnail
function addButton(anchor) {
  if (!anchor || !anchor.parentElement) return;

  let wrapper = anchor.closest('.notinterested-wrapper');

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'notinterested-wrapper';
    anchor.parentElement.insertBefore(wrapper, anchor);
    wrapper.appendChild(anchor);
  }

  // Check if already has button
  if (wrapper.querySelector('.notinterested-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'notinterested-btn';
  btn.textContent = 'X';
  btn.title = 'Not Interested';
  wrapper.appendChild(btn);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleNotInterested(anchor);
  });
}

// Function to handle not interested
function handleNotInterested(anchor) {
  // Find the video container (adjust selector based on actual DOM)
  const videoContainer = anchor.closest('ytd-rich-item-renderer') ||
                         anchor.closest('ytd-video-renderer') ||
                         anchor.closest('[class*="lockup"]') ||
                         anchor.parentElement.parentElement; // Fallback

  console.log('videoContainer:', videoContainer);

  // Find menu button (three dots)
  const menuBtn = videoContainer ? (
    videoContainer.querySelector('.yt-lockup-metadata-view-model__menu-button button') ||
    videoContainer.querySelector('button[aria-label="More actions"], button[aria-label="More options"], button[aria-label="More"], button[aria-label="Options"], button[aria-label="Menu"], button[aria-label="Ещё"]')
  ) : null;

  console.log('menuBtn:', menuBtn);

  if (menuBtn) {
    menuBtn.click();
    console.log('Menu button clicked');
    // Wait for menu to appear and click "Not Interested"
    setTimeout(() => {
      const notInterestedItem = findNotInterestedItem();
      console.log('notInterestedItem:', notInterestedItem);
      if (notInterestedItem) {
        notInterestedItem.click();
        console.log('Not interested item clicked');
        // Wait for dialog to appear, select reason, and submit
        setTimeout(() => {
          const reasonElement = findDismissalReason();
          console.log('reasonElement:', reasonElement);
          if (reasonElement) {
            reasonElement.click();
            console.log('Reason selected');
            // Wait a bit then click submit
            setTimeout(() => {
              const submitBtn = findSubmitButton();
              console.log('submitBtn:', submitBtn);
              if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
                console.log('Submit clicked');
                // Wait and close menu
                setTimeout(() => {
                  menuBtn.click();
                  console.log('Menu closed');
                }, 300);
              } else {
                console.log('Submit button not found or disabled');
              }
            }, 100);
          } else {
            console.log('No dismissal reason found');
          }
        }, 300);
      } else {
        console.log('No not interested item found');
      }
    }, 300);
  } else {
    console.log('No menu button found');
  }
}

// Find the cancel button in the dialog
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

// Find a dismissal reason in the dialog
function findDismissalReason() {
  // Look for dismissal reasons like "I don't like the video"
  const reasons = document.querySelectorAll('.dismissal-view-style-compact-tall .yt-core-attributed-string');
  let selectedReason = null;
  if (preferredReason === 'first') {
    selectedReason = reasons.length > 0 ? reasons[0] : null;
  } else if (preferredReason === 'watched') {
    selectedReason = Array.from(reasons).find(r => r.textContent.trim() === "I've already watched the video");
    if (!selectedReason) selectedReason = reasons[0]; // fallback
  } else if (preferredReason === 'dont_like') {
    selectedReason = Array.from(reasons).find(r => r.textContent.trim() === "I don't like the video");
    if (!selectedReason) selectedReason = reasons[0]; // fallback
  }
  if (selectedReason) {
    return selectedReason.closest('[role="radio"], [tabindex]');
  }
  return null;
}

// Find the submit button in the dialog
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

  // Find the "Not Interested" menu item
function findNotInterestedItem() {
  // Find items in the dropdown menu
  const menuSelector = 'tp-yt-iron-dropdown:not([aria-hidden="true"]) yt-list-item-view-model[role="menuitem"]';
  const items = document.querySelectorAll(menuSelector);
  console.log('yt-list-item-view-model items found:', items.length);
  for (const item of items) {
    const titleSpan = item.querySelector('.yt-core-attributed-string');
    const text = normalizeText(titleSpan ? titleSpan.textContent : '');
    console.log('Item text:', text || 'No title span');
    if (titleSpan && NOT_INTERESTED_VARIANTS.includes(text)) {
      return item;
    }
  }

  return null;
}
// Add buttons to all current videos
function addButtonsToVideos() {
  document.querySelectorAll('a.yt-lockup-view-model__content-image').forEach(addButton);
}

// Observer for new videos
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches('a.yt-lockup-view-model__content-image')) {
          addButton(node);
        } else {
          node.querySelectorAll('a.yt-lockup-view-model__content-image').forEach(addButton);
        }
      }
    });
  });
});

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Load user preferences
  chrome.storage.sync.get(['dismissalReason'], (result) => {
    preferredReason = result.dismissalReason || 'first';
    console.log('Loaded preferred reason:', preferredReason);
  });

  addButtonsToVideos();
  observer.observe(document.body, { childList: true, subtree: true });
}
