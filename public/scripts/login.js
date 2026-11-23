document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        email: form.email.value,
        password: form.password.value
    };

    try {
        setBusy(event.submitter, true, 'Signing in...');
        const response = await fetch('/api/login', {
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
            const requestedNext = new URLSearchParams(window.location.search).get('next');
            const destination = requestedNext && requestedNext.startsWith('/')
                ? requestedNext
                : '/profile.html';
            setTimeout(() => {
                window.location.href = destination;
            }, 1500);
        } else {
            showNotification(apiMessage(result, 'Unable to sign in'), true);
        }
    } catch (error) {
        console.error('Error logging in patient:', error);
        showNotification('An error occurred. Please try again.', true);
    } finally {
        setBusy(event.submitter, false);
    }
});
