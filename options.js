// Saves options to chrome.storage
function saveOptions() {
  const forwardKey = document.getElementById('forwardKey').value;
  const pauseKey = document.getElementById('pauseKey').value;
  const forwardTime = parseInt(document.getElementById('forwardTime').value, 10);
  
  chrome.storage.sync.set({
    forwardKey: forwardKey,
    pauseKey: pauseKey,
    forwardTime: forwardTime
  }, () => {
    console.log('Options saved');
  });
}

// Restores options from chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(['forwardKey', 'pauseKey', 'forwardTime'], (result) => {
    document.getElementById('forwardKey').value = result.forwardKey || 'f';
    document.getElementById('pauseKey').value = result.pauseKey || 'p';
    document.getElementById('forwardTime').value = result.forwardTime || 10;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', (event) => {
  event.preventDefault();
  saveOptions();
});
