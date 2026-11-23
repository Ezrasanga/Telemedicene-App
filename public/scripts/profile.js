document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the profile data
        const response = await fetch('/api/profile', { credentials: 'same-origin' });
        const user = await response.json();

        // Populate the form with the user data
        document.getElementById('first_name').value = user.first_name;
        document.getElementById('last_name').value = user.last_name;
        document.getElementById('email').value = user.email;
    } catch (error) {
        console.error('Error fetching profile:', error);
        showNotification('Error fetching profile', true);
    }
});

document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value
    };

    try {
        setBusy(event.submitter, true, 'Saving...');
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
        } else {
            showNotification(apiMessage(result, 'Unable to update profile'), true);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('An error occurred. Please try again.', true);
    } finally {
        setBusy(event.submitter, false);
    }
});
