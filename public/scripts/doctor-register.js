document.getElementById('doctorRegisterForm').addEventListener('submit', async event => {
    event.preventDefault();
    setBusy(event.submitter, true, 'Creating account...');
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    try {
        const response = await fetch('/api/doctors/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(apiMessage(result, 'Unable to create account'));
        showNotification(result.message);
        setTimeout(() => { window.location.href = '/doctor/login'; }, 1200);
    } catch (error) {
        showNotification(error.message, true);
    } finally {
        setBusy(event.submitter, false);
    }
});
