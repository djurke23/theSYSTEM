window.addEventListener('load', () => {
    const entryOverlay = document.getElementById('system-entry');
    if (entryOverlay) {
        setTimeout(() => {
            entryOverlay.classList.add('hidden');
        }, 3000);
    }
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// 3D Tilt Effect
const tiltCard = document.querySelector('.mockup-card');
if (tiltCard) {
    document.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            tiltCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        } else {
            tiltCard.style.transform = `rotateX(0) rotateY(0) scale(1)`;
        }
    });
}

// Stat Counters
const animateCounters = () => {
    const values = document.querySelectorAll('.stat-value');
    const badge = document.querySelector('.level-up-badge');

    values.forEach(val => {
        const target = +val.getAttribute('data-target');
        let current = 10;
        const increment = target / 50;

        const update = () => {
            if (current < target) {
                current = Math.min(target, current + increment);
                val.innerText = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                badge.classList.add('show');
            }
        };
        update();
    });
};

const statsSection = document.querySelector('.stats-visual');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        observer.unobserve(statsSection);
    }
}, { threshold: 0.5 });
observer.observe(statsSection);

// Quest Widget Logic
const questItems = {
    scroll: document.getElementById('quest-item-1'),
    explore: document.getElementById('quest-item-2'),
    download: document.getElementById('quest-item-3')
};

// Get header and back-to-top button elements
const header = document.querySelector('header');
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    // Header scrolled state
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // Quest item for scrolling
    if (window.scrollY > 500 && !questItems.scroll.classList.contains('completed')) {
        questItems.scroll.classList.add('completed');
    }
}, { passive: true });

// Back to top smooth scroll
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
        questItems.explore.classList.add('completed');
    });
});

document.querySelectorAll('.btn-store').forEach(btn => {
    btn.addEventListener('click', () => {
        questItems.download.classList.add('completed');
    });
});

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
