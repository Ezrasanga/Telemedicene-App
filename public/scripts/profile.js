function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4caf50';
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the profile data
        const response = await fetch('/api/profile');
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
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showNotification(result.message);
        } else {
            showNotification(result.message, true);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('An error occurred. Please try again.', true);
    }
});
