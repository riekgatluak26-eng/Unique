// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.getElementById('mobileOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('mobileOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// Counter animation (for stats)
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    if (!target) return;
    const duration = 2000, step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter, .stat-number[data-target]').forEach(el => counterObserver.observe(el));

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Contact Form + Netlify Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {

    const popup = document.getElementById('successPopup');

    function encode(data) {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
    }

    contactForm.addEventListener('submit', function(e) {

        e.preventDefault();

        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.innerHTML;

        const formData = new FormData(contactForm);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encode(data)
        })
        .then(() => {

            // Success Popup
            popup.classList.add('show');

            // Success Button
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            // Reset Form
            contactForm.reset();

            // Restore after 5 seconds
            setTimeout(() => {
                popup.classList.remove('show');

                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';

            }, 5000);

        })
        .catch((error) => {

            console.error(error);

            btn.innerHTML = originalText;
            btn.disabled = false;

            alert('Failed to send message. Please try again.');

        });

    });

}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// Project filters (if present)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.project-card').forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = ''; card.style.opacity = '1'; card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0'; card.style.transform = 'scale(0.9)';
                setTimeout(() => { card.style.display = 'none'; }, 350);
            }
        });
    });
});

// Testimonial slider (if present)
const track = document.getElementById('testimonialTrack');
if (track) {
    let currentSlide = 0, totalSlides = document.querySelectorAll('.testimonial-card').length;
    let autoSlideInterval;
    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    }
    resetAutoSlide();
    track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    track.addEventListener('mouseleave', resetAutoSlide);
    window.goToSlide = goToSlide; // for dot clicks
}

// Lightbox (if present)
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    document.querySelectorAll('.project-card, .project-overlay-btn').forEach(el => {
        el.addEventListener('click', function(e) {
            const img = this.closest('.project-card')?.querySelector('.project-image img');
            if (img) {
                document.getElementById('lightboxImg').src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

// Initial reveal on load
window.addEventListener('load', () => {
    revealElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
});
// Infinite smooth logo scroll
(function() {
    const track = document.getElementById('logoTrack');
    if (!track) return;

    // Clone the logo set to create a seamless loop
    const originalSet = track.querySelector('.logo-set');
    if (originalSet) {
        const clone = originalSet.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // hide from screen readers
        track.appendChild(clone);
    }

    // Start animation
    track.classList.add('animated');
})();

/* ===== PROJECT SLIDER (GPU accelerated) ===== */
class ProjectSlider {
    constructor(sliderEl) {
        this.slider = sliderEl;
        this.track = sliderEl.querySelector('.slider-track');
        this.slides = sliderEl.querySelectorAll('.slider-slide');
        this.prevBtn = sliderEl.querySelector('.prev');
        this.nextBtn = sliderEl.querySelector('.next');
        this.counterCurrent = sliderEl.querySelector('.current');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = parseInt(sliderEl.dataset.autoplay) || 4000;
        this.autoplayTimer = null;
        this.isPaused = false;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartTime = 0;
        this.init();
    }

    init() {
        if (!this.prevBtn || !this.nextBtn || !this.track || !this.slides.length) return;

        this.prevBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.prev(); });
        this.nextBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.next(); });

        this.slider.addEventListener('mouseenter', () => this.pause());
        this.slider.addEventListener('mouseleave', () => this.resume());

        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartTime = Date.now();
            this.pause();
        }, { passive: true });

        this.slider.addEventListener('touchmove', (e) => {
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.slider.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            const timeDiff = Date.now() - this.touchStartTime;
            const velocity = Math.abs(diff) / timeDiff;
            if (Math.abs(diff) > 50 || velocity > 0.3) {
                if (diff > 0) this.next();
                else this.prev();
            }
            this.resume();
        });

        this.track.addEventListener('transitionend', () => {
            this.isTransitioning = false;
        });

        this.preloadAdjacentImages();
        this.startAutoplay();
    }

    preloadAdjacentImages() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        [nextIndex, prevIndex].forEach(idx => {
            const img = this.slides[idx]?.querySelector('img');
            if (img && !img.complete) {
                const preload = new Image();
                preload.src = img.src;
            }
        });
    }

    updateSlide() {
        if (this.isTransitioning || !this.track) return;
        this.isTransitioning = true;
        this.track.style.transform = `translate3d(-${this.currentIndex * 100}%, 0, 0)`;
        if (this.counterCurrent) this.counterCurrent.textContent = this.currentIndex + 1;
        setTimeout(() => this.preloadAdjacentImages(), 400);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlide();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }

    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            if (!this.isPaused && !this.isTransitioning) this.next();
        }, this.autoplayInterval);
    }

    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
}

// Initialize all sliders
window.addEventListener('load', () => {
    document.querySelectorAll('.project-slider').forEach(slider => new ProjectSlider(slider));
});
