const doctorSelect = document.getElementById('doctor_id');
const dateInput = document.getElementById('appointment_date');

function toLocalDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

dateInput.min = toLocalDateInputValue(new Date());

async function loadDoctors() {
    try {
        const response = await fetch('/api/doctors', { credentials: 'same-origin' });
        const doctors = await response.json();
        if (!response.ok) {
            throw new Error(apiMessage(doctors, 'Unable to load doctors'));
        }

        doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
        if (!Array.isArray(doctors) || doctors.length === 0) {
            doctorSelect.innerHTML = '<option value="">No doctors available</option>';
            doctorSelect.disabled = true;
            return;
        }

        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            const name = [doctor.first_name, doctor.last_name].filter(Boolean).join(' ');
            option.textContent = `Dr. ${name || doctor.id}${doctor.specialization ? ` - ${doctor.specialization}` : ''}`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        doctorSelect.innerHTML = '<option value="">Doctors unavailable</option>';
        doctorSelect.disabled = true;
        showNotification(error.message, true);
    }
}

loadDoctors();

document.getElementById('bookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const data = {
        doctor_id: form.doctor_id.value,
        appointment_date: form.appointment_date.value,
        appointment_time: form.appointment_time.value
    };

    try {
        setBusy(event.submitter, true, 'Booking...');
        const response = await fetch('/api/book', {
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
                window.location.href = '/appointments';
            }, 1500);
        } else {
            showNotification(apiMessage(result, 'Unable to book appointment'), true);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showNotification('An error occurred. Please try again.', true);
    } finally {
        setBusy(event.submitter, false);
    }
});