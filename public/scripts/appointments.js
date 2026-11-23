// appointments.js
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/appointments', { credentials: 'same-origin' });
        const result = await response.json();

        if (!response.ok) {
            showNotification(result.message || 'Error fetching appointments', true);
            return;
        }

        const appointmentsContainer = document.getElementById('appointments');
        if (result.length === 0) {
            appointmentsContainer.innerHTML = '<div class="empty-state">No appointments found. <a href="book.html">Book your first appointment</a>.</div>';
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
                ${appointment.status === 'scheduled'
                    ? `<button type="button" data-action="reschedule" data-id="${appointment.id}">Reschedule</button>
                       <button type="button" data-action="cancel" data-id="${appointment.id}">Cancel</button>`
                    : ''}
            `;
            appointmentsContainer.appendChild(appointmentDiv);
        });

        document.getElementById('appointments').addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) {
                return;
            }

            const appointmentId = button.dataset.id;
            if (button.dataset.action === 'cancel') {
                if (!window.confirm('Cancel this appointment?')) {
                    return;
                }

                const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
                    method: 'PATCH',
                    credentials: 'same-origin'
                });
                const result = await response.json();
                showNotification(result.message, !response.ok);
                if (response.ok) {
                    window.location.reload();
                }
                return;
            }

            const appointmentDate = window.prompt('New date (YYYY-MM-DD):');
            const appointmentTime = window.prompt('New time (HH:mm):');
            if (!appointmentDate || !appointmentTime) {
                return;
            }

            const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({
                    appointment_date: appointmentDate,
                    appointment_time: appointmentTime
                })
            });
            const result = await response.json();
            showNotification(result.message, !response.ok);
            if (response.ok) {
                window.location.reload();
            }
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        showNotification('Error fetching appointments', true);
    }
});
