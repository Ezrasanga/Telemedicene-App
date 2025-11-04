function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4caf50';
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

document.getElementById('bookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        patient_id: form.patient_id.value,
        doctor_id: form.doctor_id.value,
        appointment_date: form.appointment_date.value,
        appointment_time: form.appointment_time.value
    };

    try {
        const response = await fetch('/api/book', {
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
                window.location.href = '/appointments.html';
            }, 1500);
        } else {
            showNotification(result.message, true);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showNotification('An error occurred. Please try again.', true);
    }
});