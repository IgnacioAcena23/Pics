document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');
            navLinksContainer.classList.toggle('is-open');
        });
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburgerBtn && hamburgerBtn.classList.contains('is-active')) {
                hamburgerBtn.classList.remove('is-active');
                navLinksContainer.classList.remove('is-open');
            }
        });
    });
});
