let modeActive = false;

// Function to hide video title and control buttons
function hideControls() {
  const title = document.querySelector('.title.ytd-video-primary-info-renderer');
  const buttons = document.querySelector('#menu-container');
  if (title) {
    title.style.display = 'none';
  }
  if (buttons) {
    buttons.style.display = 'none';
  }
}

// Function to show video title and control buttons
function showControls() {
  const title = document.querySelector('.title.ytd-video-primary-info-renderer');
  const buttons = document.querySelector('#menu-container');
  if (title) {
    title.style.display = 'block';
  }
  if (buttons) {
    buttons.style.display = 'block';
  }
}

// Function to toggle mode
function toggleMode() {
  modeActive = !modeActive;
  if (modeActive) {
    hideControls();
  } else {
    showControls();
  }
}

// Event listeners for pausing and playing the video
const video = document.querySelector('video');
if (video) {
  video.addEventListener('pause', () => {
    if (modeActive) {
      hideControls();
    }
  });
  video.addEventListener('play', () => {
    if (!modeActive) {
      showControls();
    }
  });
}

// Function to forward or rewind the video by a specific time
function seekVideo(time) {
  if (video) {
    video.currentTime += time;
    if (modeActive) {
      hideControls();
    }
  }
}

// Load key and time configuration from storage
chrome.storage.sync.get(['forwardKey', 'pauseKey', 'forwardTime'], (result) => {
  const forwardKey = result.forwardKey || 'f'; // Default key 'f'
  const pauseKey = result.pauseKey || 'p'; // Default key 'p'
  const forwardTime = result.forwardTime || 10; // Default time 10 seconds

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'y') {
      toggleMode();
    } else if (modeActive) {
      if (event.key === forwardKey) {
        seekVideo(forwardTime);
      } else if (event.key === pauseKey) {
        if (video.paused) {
          video.play();
          if (!modeActive) {
            showControls();
          }
        } else {
          video.pause();
          if (modeActive) {
            hideControls();
          }
        }
      }
    }
  });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'seekVideo') {
    seekVideo(request.time);
  }
});
