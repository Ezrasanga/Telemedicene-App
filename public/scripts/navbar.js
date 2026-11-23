const toggle = document.querySelector('[data-nav-toggle]');
const links = document.querySelector('[data-nav-links]');

if (toggle && links) {
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        links.classList.toggle('open', !expanded);
    });

    links.addEventListener('click', event => {
        if (event.target.closest('a')) {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('open');
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('open');
            toggle.focus();
        }
    });
}

document.querySelectorAll('[data-logout]').forEach(link => {
    link.addEventListener('click', async event => {
        event.preventDefault();
        await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
        window.location.href = link.dataset.logout;
    });

    async function updateRoleNavigation() {
        let session = null;
        try {
            const response = await fetch('/api/me', { credentials: 'same-origin' });
            if (response.ok) {
                session = await response.json();
            }
        } catch (error) {
            session = null;
        }

        document.querySelectorAll('[data-auth-required]').forEach(element => {
            const requiredRole = element.dataset.role;
            element.hidden = !session || (requiredRole && session.role !== requiredRole);
        });

        document.querySelectorAll('[data-guest-only]').forEach(element => {
            element.hidden = Boolean(session);
        });
    }

    updateRoleNavigation();
});
