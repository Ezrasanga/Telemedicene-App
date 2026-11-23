document.getElementById('doctorLoginForm').addEventListener('submit', async event => {
    event.preventDefault();
    setBusy(event.submitter, true, 'Signing in...');
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    try {
        const response = await fetch('/api/doctors/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(apiMessage(result, 'Unable to sign in'));
        showNotification(result.message);
        setTimeout(() => { window.location.href = '/doctor/dashboard'; }, 800);
    } catch (error) {
        showNotification(error.message, true);
    } finally {
        setBusy(event.submitter, false);
    }
});
