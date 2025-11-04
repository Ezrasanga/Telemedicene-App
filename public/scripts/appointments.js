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
        const appointments = await response.json();

        const appointmentsContainer = document.getElementById('appointments');
        appointments.forEach(appointment => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.innerHTML = `
                <h3>Appointment with Dr. ${appointment.doctor_name}</h3>
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
