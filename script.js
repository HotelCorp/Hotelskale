document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;


    /* NAVBAR SCROLL EFFECT + TOP HIDE/SHOW */
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Show navbar once you leave the very top, hide again when you return
        if (scrollY > 100) {
            document.body.classList.remove('navbar-hidden-initial');
            document.body.classList.add('navbar-visible');
        } else {
            document.body.classList.add('navbar-hidden-initial');
            document.body.classList.remove('navbar-visible');
        }

        // Subtle shadow / lift on further scroll
        if (scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    /* MOBILE MENU */
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    /* SMOOTH SCROLL FOR ANCHOR LINKS */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const rect = targetElement.getBoundingClientRect();
            const offsetTop = rect.top + window.pageYOffset - 90;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });

    /* THEME TOGGLE (DARK / LIGHT) */
    const THEME_KEY = 'hotel-skale-theme';

    function applyTheme(theme) {
        const normalized = theme === 'light' ? 'light' : 'dark';
        body.setAttribute('data-theme', normalized);
        localStorage.setItem(THEME_KEY, normalized);
    }

    // Initial theme: saved preference or prefers-color-scheme
    (function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') {
            applyTheme(saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    })();

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }

    /* SIMPLE FADE/SLIDE ANIMATIONS ON SCROLL */
    const observerOptions = {
        threshold: 0.18,
        rootMargin: '0px 0px -80px 0px'
    };

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.figure-card, .feature-card, .step-item, .testimonies-card, .testimonies-histogram, .performance-metrics-item, .contact-form-wrapper')
        .forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(22px)';
            const delay = index * 0.08;
            el.style.transition =
                `opacity 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s, ` +
                `transform 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`;
            revealObserver.observe(el);
        });

   

    /* EMAILJS INITIALISATION */
    if (window.emailjs) {
        try {
            emailjs.init('kxztnmYk_v8LTu9il'); // keep your existing public key
        } catch (e) {
            console.warn('EmailJS init error:', e);
        }
    }

    /* CONTACT FORM HANDLING */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus && window.emailjs) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending…';
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            try {
                await emailjs.send(
                    'service_ajmnp78',      // your EmailJS service ID
                    'template_u2sw7hf',     // your EmailJS template ID
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        message: formData.message,
                        to_email: 'hotelskale@gmail.com'
                    }
                );

                formStatus.textContent = "Thank you. Your message has been sent – we'll respond shortly.";
                formStatus.classList.add('success');
                contactForm.reset();
            } catch (error) {
                console.error('EmailJS Error:', error);
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly.';
                formStatus.classList.add('error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    console.log('HOTEL SKALE site loaded.');
});
