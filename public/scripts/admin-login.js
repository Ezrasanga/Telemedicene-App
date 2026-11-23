document.getElementById('adminLoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
        setBusy(event.submitter, true, 'Signing in...');
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
            // Redirect after a short delay so user sees the notification
            setTimeout(() => {
                window.location.href = '/admin-dashb.html';
            }, 1500);
        } else {
            showNotification(apiMessage(result, 'Unable to sign in'), true);
        }
    } catch (error) {
        console.error('Error logging in admin:', error);
        showNotification('An error occurred. Please try again.', true);
    } finally {
        setBusy(event.submitter, false);
    }
});
