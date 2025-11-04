function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4caf50';
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        email: form.email.value,
        password: form.password.value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
            // Redirect after a short delay so user sees the notification
            setTimeout(() => {
                window.location.href = '/profile.html';
            }, 1500);
        } else {
            showNotification(result.message, true);
        }
    } catch (error) {
        console.error('Error logging in patient:', error);
        showNotification('An error occurred. Please try again.', true);
    }
});
