async function loadAppointments() {
    const container = document.getElementById('doctorAppointments');
    try {
        const response = await fetch('/api/doctors/appointments', { credentials: 'same-origin' });
        const appointments = await response.json();
        if (!response.ok) throw new Error(apiMessage(appointments, 'Unable to load appointments'));
        if (appointments.length === 0) {
            container.innerHTML = '<div class="empty-state">No appointments booked yet.</div>';
            return;
        }
        container.innerHTML = appointments.map(appointment => `
            <article class="appointment">
                <h3>${appointment.patient_first_name || ''} ${appointment.patient_last_name || ''}</h3>
                <p><strong>Date:</strong> ${appointment.appointment_date}</p>
                <p><strong>Time:</strong> ${appointment.appointment_time}</p>
                <span class="status ${appointment.status === 'cancelled' ? 'cancelled' : ''}">${appointment.status}</span>
            </article>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="empty-state">Unable to load appointments.</div>';
        showNotification(error.message, true);
    }
}

loadAppointments();
