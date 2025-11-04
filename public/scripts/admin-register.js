function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4caf50';
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

document.getElementById('adminRegisterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        username: form.username.value,
        password: form.password.value,
        role: form.role.value,
        email: form.email.value
    };

    try {
        const response = await fetch('/api/admin/register', {
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
                window.location.href = '/admin-login.html';
            }, 1500);
        } else {
            showNotification(result.message, true);
        }
    } catch (error) {
        console.error('Error registering admin:', error);
        showNotification('An error occurred. Please try again.', true);
    }
});
