// Save preferences
document.getElementById('optionsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const reason = document.querySelector('input[name="reason"]:checked').value;
    chrome.storage.sync.set({ dismissalReason: reason }, () => {
        document.getElementById('savedMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('savedMessage').style.display = 'none';
        }, 2000);
    });
});

// Load saved preferences
chrome.storage.sync.get(['dismissalReason'], (result) => {
    const reason = result.dismissalReason || 'first';
    document.querySelector(`input[name="reason"][value="${reason}"]`).checked = true;
});
