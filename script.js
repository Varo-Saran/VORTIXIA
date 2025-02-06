// Add this to script.js
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        this.src = '/api/placeholder/400/320';
        this.alt = 'Placeholder image';
    };
});


// Initialize GSAP and ScrollTrigger if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Theme toggle functionality
function setTheme(isDark) {
    const body = document.body;
    body.classList.toggle('dark-theme', isDark);
    body.classList.toggle('light-theme', !isDark);
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.setAttribute('aria-checked', isDark);
}

// Core navigation functionality
function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')
        ) {
            link.classList.add('active');
        }
    });
}

// Fix grid alignment
function fixGridAlignment() {
    // Fix for project cards grid
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        // Reset heights first
        projectCards.forEach(card => card.style.height = 'auto');
        
        // Get the maximum height
        const maxHeight = Math.max(...Array.from(projectCards).map(card => card.offsetHeight));
        
        // Set all cards to the maximum height
        projectCards.forEach(card => card.style.height = maxHeight + 'px');
    }

    // Fix for service cards grid
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        serviceCards.forEach(card => card.style.height = 'auto');
        const maxHeight = Math.max(...Array.from(serviceCards).map(card => card.offsetHeight));
        serviceCards.forEach(card => card.style.height = maxHeight + 'px');
    }
}

// Mobile menu setup
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const submenuTriggers = document.querySelectorAll('.mobile-submenu-trigger');
    const backButtons = document.querySelectorAll('.mobile-back-button');
    const body = document.body;
 
    function toggleMobileNav() {
        if (!mobileNavOverlay) return;
        hamburger.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    }
 
    function closeMobileNav() {
        hamburger.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.querySelectorAll('.mobile-submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
        });
        body.style.overflow = '';
    }
 
    function handleSubmenuTrigger(trigger) {
        const submenuId = trigger.getAttribute('data-submenu');
        const targetSubmenu = document.querySelector(`.mobile-submenu[data-submenu="${submenuId}"]`);
        if (targetSubmenu) {
            targetSubmenu.classList.add('active');
        }
    }
 
    function handleBackButton(button) {
        const submenu = button.closest('.mobile-submenu');
        if (submenu) {
            submenu.classList.remove('active');
        }
    }
 
    // Event listeners
    hamburger.addEventListener('click', toggleMobileNav);
 
    submenuTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            handleSubmenuTrigger(trigger);
        });
    });
 
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleBackButton(button);
        });
    });
 
    mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay) {
            closeMobileNav();
        }
    });
 
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            closeMobileNav();
        }
    });
 
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
            closeMobileNav();
        }
    });
 }
 
 // Initialize
 document.addEventListener('DOMContentLoaded', setupHamburgerMenu);
 
 // Handle window resize 
 function handleResize() {
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    if (window.innerWidth > 992 && mobileNavOverlay?.classList.contains('active')) {
        closeMobileNav();
    }
 }
 
 window.addEventListener('resize', handleResize);

// Animation setup
function setupAnimations() {
    if (typeof gsap === 'undefined') return;

    // Remove AOS attributes and add GSAP classes
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.removeAttribute('data-aos');
        element.removeAttribute('data-aos-delay');
        element.classList.add('gsap-animate');
    });

    // Ensure grid alignment before animations
    fixGridAlignment();

    // Card animations with consistent bottom-to-top animation
    function animateCards(selector) {
        const cards = document.querySelectorAll(selector);
        if (cards.length === 0) return;

        cards.forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                onComplete: () => {
                    card.style.opacity = '';
                    card.style.transform = '';
                }
            });
        });
    }

    // Animate all card types
    animateCards('.project-card');
    animateCards('.service-card');
    animateCards('.team-member');
    animateCards('.value-card');
    animateCards('.why-choose-card');

    // Section animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Hero section if it exists
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const heroElements = {
            title: heroSection.querySelector('h1'),
            description: heroSection.querySelector('p'),
            cta: heroSection.querySelector('.cta-button')
        };

        if (heroElements.title) {
            gsap.from(heroElements.title, { opacity: 0, y: 50, duration: 1 });
        }
        if (heroElements.description) {
            gsap.from(heroElements.description, { opacity: 0, y: 50, duration: 1, delay: 0.3 });
        }
        if (heroElements.cta) {
            gsap.from(heroElements.cta, { opacity: 0, y: 50, duration: 1, delay: 0.6 });
        }
    }
}

function setupCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Click handlers for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    setInterval(nextSlide, slideInterval);
}


// Image handling
function setupImageHandling() {
    // Handle missing images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.src = '/api/placeholder/400/320';
            img.alt = 'Image placeholder';
        });
    });

    // Add loading attribute
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
    });
}

// Accessibility enhancements
function setupAccessibility() {
    // Add aria-labels where missing
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (button.textContent) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Add aria-current for active navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.setAttribute('aria-current', link.classList.contains('active') ? 'page' : 'false');
    });

    // Make cards keyboard focusable
    document.querySelectorAll('.service-card, .project-card').forEach(card => {
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
    });
}

// Focus state management
function setupFocusStates() {
    // Add focus visibility class to body when using keyboard
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-focus');
        }
    });

    // Remove focus visibility on mouse use
    document.body.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-focus');
    });

    // Enhance card focus behavior
    const cards = document.querySelectorAll('.service-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('focus', () => {
            card.classList.add('card-focused');
        });
        card.addEventListener('blur', () => {
            card.classList.remove('card-focused');
        });
    });
}

// Back to top functionality
function setupBackToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.classList.add('back-to-top');
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        button.classList.toggle('show', window.scrollY > 300);
    });

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Circle Animation Setup
function setupCircleAnimation() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    function createCircles() {
        // Remove existing circles if any
        const existingCircles = heroBackground.querySelector('.circles');
        if (existingCircles) {
            existingCircles.remove();
        }

        // Create new circles container
        const circlesContainer = document.createElement('div');
        circlesContainer.classList.add('circles');

        // Define circle configurations
        const circleConfigs = [
            { left: '25%', width: '80px', height: '80px', delay: '0s', duration: '25s' },
            { left: '10%', width: '20px', height: '20px', delay: '2s', duration: '12s' },
            { left: '70%', width: '20px', height: '20px', delay: '4s', duration: '25s' },
            { left: '40%', width: '60px', height: '60px', delay: '0s', duration: '18s' },
            { left: '65%', width: '20px', height: '20px', delay: '0s', duration: '25s' }
        ];

        // Create circles based on configuration
        circleConfigs.forEach((config) => {
            const circle = document.createElement('div');
            
            // Apply styles
            Object.assign(circle.style, {
                left: config.left,
                width: config.width,
                height: config.height,
                animationDelay: config.delay,
                animationDuration: config.duration
            });

            circlesContainer.appendChild(circle);
        });

        // Add additional random circles
        const additionalCircles = window.innerWidth <= 768 ? 3 : 10;
        for (let i = 0; i < additionalCircles; i++) {
            const circle = document.createElement('div');
            const size = Math.random() * (window.innerWidth <= 768 ? 30 : 50) + 10;
            
            Object.assign(circle.style, {
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 15 + 10}s`
            });

            circlesContainer.appendChild(circle);
        }

        heroBackground.appendChild(circlesContainer);
    }

    // Create initial circles
    createCircles();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createCircles, 250);
    });

    // Optional: Recreate circles periodically for continuous fresh animation
    setInterval(createCircles, 50000); // Recreate every 50 seconds
}

// Navigation Hide/Show on Scroll
let lastScrollTop = 0;
const nav = document.querySelector('.glassy-nav');
const navHeight = nav.offsetHeight;

function handleNavScroll() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add transition styles to nav
    nav.style.transition = 'all 0.4s ease';
    
    if (currentScroll > lastScrollTop && currentScroll > navHeight) {
        // Scrolling down & past navbar height
        nav.style.transform = 'translateY(-100%)';
        nav.style.opacity = '0';
    } else {
        // Scrolling up or at top
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
    }
    
    // Special case for top of page
    if (currentScroll <= 0) {
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}

// Add throttling to smooth out the scroll handler
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Use throttled version of scroll handler
window.addEventListener('scroll', throttle(handleNavScroll, 100));



// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add initialization class
    document.body.classList.add('dom-ready');
    
    // Theme initialization
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme.matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }

    // Theme toggle event listener
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-theme');
        setTheme(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Initialize all components
    updateActiveNavLink();
    setupHamburgerMenu();
    setupBackToTop();
    setupImageHandling();
    setupAccessibility();
    setupFocusStates();
    setupCircleAnimation();
    setupCarousel();
    handleResize()
    
    // Initialize animations
    setTimeout(setupAnimations, 100);
});

// Event listeners
window.addEventListener('popstate', updateActiveNavLink);
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleNavScroll);

// Initial grid fix on load
window.addEventListener('load', fixGridAlignment);