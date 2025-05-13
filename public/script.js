function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    const toggleButton = document.getElementById('nav-toggle');
    const isActive = menu.classList.toggle('active');
    toggleButton.setAttribute('aria-expanded', isActive ? 'true' : 'false');
}

// Animate about-me section and brand span on scroll
document.addEventListener('DOMContentLoaded', function() {
    const aboutMeSection = document.querySelector('.aboutme');
    const aboutMeBrand = document.querySelector('.aboutme-brand');

    if (aboutMeSection) {
        aboutMeSection.classList.add('aboutme-animate');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutMeSection.classList.add('visible');
                    if (aboutMeBrand) {
                        aboutMeBrand.style.animation = 'brandPopUp 1.2s cubic-bezier(.23,1.01,.32,1) both';
                    }
                }
            });
        }, { threshold: 0.3 });
        observer.observe(aboutMeSection);
    }
});