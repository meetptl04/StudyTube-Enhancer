document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  const forwardKeyInput = document.getElementById('forwardKey');
  const backwardKeyInput = document.getElementById('backwardKey');
  const forwardSecondsInput = document.getElementById('forwardSeconds');
  const backwardSecondsInput = document.getElementById('backwardSeconds');

  // Load saved settings
  chrome.storage.sync.get(['forwardKey', 'backwardKey', 'forwardSeconds', 'backwardSeconds'], (result) => {
    forwardKeyInput.value = result.forwardKey || 'h'; // Default 'h' for forward
    backwardKeyInput.value = result.backwardKey || 'g'; // Default 'g' for backward
    forwardSecondsInput.value = result.forwardSeconds || '2';
    backwardSecondsInput.value = result.backwardSeconds || '2';
  });

  // Save settings on button click
  saveBtn.addEventListener('click', () => {
    const forwardKey = forwardKeyInput.value.trim() || 'h'; // Default 'h' if empty
    const backwardKey = backwardKeyInput.value.trim() || 'g'; // Default 'g' if empty
    const forwardSeconds = parseInt(forwardSecondsInput.value, 10) || 2;
    const backwardSeconds = parseInt(backwardSecondsInput.value, 10) || 2;

    chrome.storage.sync.set({
      forwardKey,
      backwardKey,
      forwardSeconds,
      backwardSeconds
    }, () => {
      alert('Settings saved successfully!');
    });
  });
});
