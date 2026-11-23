// appointments.js
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.background = isError ? '#f44336' : '#4caf50';
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/appointments');
        const result = await response.json();

        if (!response.ok) {
            showNotification(result.message || 'Error fetching appointments', true);
            return;
        }

        const appointmentsContainer = document.getElementById('appointments');
        if (result.length === 0) {
            appointmentsContainer.textContent = 'No appointments found.';
            return;
        }

        result.forEach(appointment => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.innerHTML = `
                <h3>Appointment with Dr. ${appointment.doctor_name || appointment.doctor_id}</h3>
                <p>Date: ${appointment.appointment_date}</p>
                <p>Time: ${appointment.appointment_time}</p>
                <p>Status: ${appointment.status}</p>
            `;
            appointmentsContainer.appendChild(appointmentDiv);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        showNotification('Error fetching appointments', true);
    }
});
