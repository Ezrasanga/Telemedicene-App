document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        password: form.password.value
    };

    try {
        setBusy(event.submitter, true, 'Creating account...');
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
            // Redirect to login page or profile page after a short delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        } else {
            showNotification(apiMessage(result, 'Unable to create account'), true);
        }
    } catch (error) {
        console.error('Error registering patient:', error);
        showNotification('An error occurred. Please try again.', true);
    } finally {
        setBusy(event.submitter, false);
    }
});