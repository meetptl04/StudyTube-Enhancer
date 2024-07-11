let modeActive = false;
let injectedStyle = null;
let forwardKey = 'ArrowRight';
let backwardKey = 'ArrowLeft';
let forwardSeconds = 2;
let backwardSeconds = 2;

// Function to toggle mode
function toggleMode() {
  modeActive = !modeActive;
  if (modeActive) {
    injectStyle(".ytp-chrome-top, .ytp-chrome-bottom { display: none !important; }");
  } else {
    removeInjectedStyle();
  }
}

// Function to inject custom CSS style
function injectStyle(css) {
  removeInjectedStyle(); // Remove any existing injected style

  injectedStyle = document.createElement('style');
  injectedStyle.type = 'text/css';
  injectedStyle.textContent = css;
  document.head.appendChild(injectedStyle);
}

// Function to remove injected style
function removeInjectedStyle() {
  if (injectedStyle && injectedStyle.parentNode) {
    injectedStyle.parentNode.removeChild(injectedStyle);
    injectedStyle = null;
  }
}

// Function to forward or rewind the video by a specific time
function seekVideo(time) {
  const video = document.querySelector('video');
  if (video) {
    video.currentTime += time;
    if (modeActive) {
      injectStyle(".ytp-chrome-top, .ytp-chrome-bottom { display: none !important; }");
    }
  }
}

// Load key configuration from storage
chrome.storage.sync.get(['forwardKey', 'backwardKey', 'forwardSeconds', 'backwardSeconds'], (result) => {
  forwardKey = result.forwardKey || 'h';
  backwardKey = result.backwardKey || 'g';
  forwardSeconds = result.forwardSeconds || 2;
  backwardSeconds = result.backwardSeconds || 2;

  // Event listener for key presses
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'y') {
      toggleMode();
    } else if (modeActive) {
      if (event.key === forwardKey) {
        seekVideo(forwardSeconds);
      } else if (event.key === backwardKey) {
        seekVideo(-backwardSeconds);
      }
    } else if (!modeActive) {
      if (event.key === forwardKey) {
        seekVideo(forwardSeconds);
      } else if (event.key === backwardKey) {
        seekVideo(-backwardSeconds);
      }
    }
  });
});

// Initialize video event listeners
function initializeVideoListeners() {
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('play', () => {
      if (!modeActive) {
        removeInjectedStyle();
      }
    });
  }
}

// Ensure video listeners are set up when the page loads
window.addEventListener('load', initializeVideoListeners);
initializeVideoListeners(); // Call it immediately in case the video is already loaded

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'seekVideo') {
    seekVideo(request.time);
  }
});
