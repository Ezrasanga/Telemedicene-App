function showNotification(message, isError = false) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.setAttribute('role', 'status');
        document.body.appendChild(notification);
    }

    notification.className = `notification${isError ? ' error' : ''}`;
    notification.textContent = message;
    clearTimeout(notification.hideTimer);
    notification.hideTimer = setTimeout(() => {
        notification.remove();
    }, 4000);
}

function setBusy(button, busy, busyText = 'Please wait...') {
    if (!button) return;
    if (busy) {
        button.dataset.originalText = button.textContent;
        button.textContent = busyText;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
    }
}

function apiMessage(result, fallback) {
    return result?.error?.message || result?.message || fallback;
}
