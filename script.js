/* ============================================
   ANISA MUTIARA DEWI - PORTFOLIO
   JavaScript: Language Toggle, Lightbox,
   Navigation, Filters, Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LANGUAGE TOGGLE
    // ==========================================
    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    let currentLang = localStorage.getItem('portfolio-lang') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('portfolio-lang', lang);

        if (lang === 'id') {
            document.body.classList.add('lang-id');
        } else {
            document.body.classList.remove('lang-id');
        }

        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        html.lang = lang;
    }

    langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'id' : 'en');
    });

    // Apply saved language on load
    setLanguage(currentLang);

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    const navHamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    navHamburger.addEventListener('click', () => {
        navHamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navHamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('.section, .hero');
    const navItems = document.querySelectorAll('.nav-links a');

    function setActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ==========================================
    // PROJECT FILTERS
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ==========================================
    // LIGHTBOX
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTenant = document.getElementById('lightboxTenant');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentLightboxImages = [];
    let currentLightboxIndex = 0;
    let currentTenant = '';

    // Tenant name mapping for display
    const tenantNames = {
        'maison-tatsuya': 'Maison Tatsuya',
        'maxx-coffee': 'Maxx Coffee',
        'steak-21': 'Steak 21',
        'oppo': 'OPPO',
        'tous-les-jours': 'Tous Les Jours',
        'pho-ba-ba': 'Pho Ba Ba',
        'pancious': 'Pancious',
        'chadol-gujeolpan': 'Chadol Gujeolpan',
        'peoples-cafe': "The People's Cafe",
        'yakiniku-like': 'Yakiniku Like',
        'birkenstock': 'Birkenstock',
        'levis': "Levi's",
        'guardian': 'Guardian',
        'boots': 'Boots',
        'adidas': 'Adidas',
        'havaianas': 'Havaianas',
        'converse': 'Converse',
        'miniso': 'Miniso',
        'vans': 'Vans',
        'by-aura': 'By Aura'
    };

    function getImagesForTenant(tenant, category) {
        const images = [];
        const prefix = category === 'fb' ? 'fb' : 'retail';
        let i = 1;
        // Try to find images up to 5 per tenant
        while (i <= 5) {
            const img = new Image();
            img.src = `images/${prefix}/${tenant}-${i}.jpg`;
            if (img.complete && img.naturalWidth > 0) {
                images.push(img.src);
                i++;
            } else {
                break;
            }
        }
        return images;
    }

    function openLightbox(card) {
        const tenant = card.getAttribute('data-tenant');
        const category = card.getAttribute('data-category');
        currentTenant = tenant;

        // Get all images for this tenant
        currentLightboxImages = [];
        const prefix = category === 'fb' ? 'fb' : 'retail';

        // Use the card's main image + try to find additional images
        const mainImg = card.querySelector('img');
        if (mainImg) {
            currentLightboxImages.push(mainImg.src);
        }

        // Try to find additional images
        for (let i = 2; i <= 5; i++) {
            const testImg = new Image();
            testImg.src = `images/${prefix}/${tenant}-${i}.jpg`;
            // We'll add them if they exist (checked via onerror/onload)
            currentLightboxImages.push(`images/${prefix}/${tenant}-${i}.jpg`);
        }

        // Filter to only existing images by testing
        const validImages = [];
        const testPromises = currentLightboxImages.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(src);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        });

        Promise.all(testPromises).then(results => {
            currentLightboxImages = results.filter(r => r !== null);
            if (currentLightboxImages.length > 0) {
                currentLightboxIndex = 0;
                showLightboxImage();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    function showLightboxImage() {
        if (currentLightboxImages.length === 0) return;

        lightboxImg.src = currentLightboxImages[currentLightboxIndex];
        lightboxTenant.textContent = tenantNames[currentTenant] || currentTenant;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function nextImage() {
        if (currentLightboxImages.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        showLightboxImage();
    }

    function prevImage() {
        if (currentLightboxImages.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        showLightboxImage();
    }

    // Attach click events to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', () => openLightbox(card));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // ==========================================
    // SCROLL ANIMATIONS (IntersectionObserver)
    // ==========================================
    const animateElements = document.querySelectorAll(
        '.stat-card, .timeline-item, .project-card, .skill-category, .contact-item, .education-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});

/* CSS Animation Keyframes (injected via JS for fade-in) */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
