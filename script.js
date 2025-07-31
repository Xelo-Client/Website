// Enhanced JavaScript with mobile drawer functionality
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile drawer functionality ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');

    // Toggle mobile drawer
    function toggleDrawer() {
        mobileDrawer.classList.toggle('open');
        drawerOverlay.classList.toggle('active');
        document.body.classList.toggle('drawer-open');
    }

    // Close mobile drawer
    function closeDrawerFn() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.classList.remove('drawer-open');
    }

    // Event listeners for drawer (with null checks for safety)
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleDrawer);
    if (closeDrawer) closeDrawer.addEventListener('click', closeDrawerFn);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawerFn);

    // Close drawer on nav link click
    document.querySelectorAll('.drawer-nav a').forEach(link => {
        link.addEventListener('click', closeDrawerFn);
    });

    // Close drawer on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
            closeDrawerFn();
        }
    });

    // --- Smooth scrolling for navigation links ---
    // Selects all anchor tags whose href starts with '#'
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent the default anchor click behavior
            e.preventDefault();
            // Get the target element using the href attribute
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Scroll to the target element smoothly
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Navbar background effect on scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Change navbar background color when scrolling down
            if (window.scrollY > 50) {
                // Using CSS variables for background with transparency
                navbar.style.background = 'hsl(var(--primary) / 0.98)';
            } else {
                navbar.style.background = 'hsl(var(--primary) / 0.95)';
            }
        });
    }

    // --- Fade-in animation on scroll using Intersection Observer ---
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust the viewport margin
    };

    // Create a new observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is intersecting the viewport, add the 'visible' class
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with the 'fade-in' class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // --- Add click ripple effect to buttons ---
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create a span element for the ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Style the ripple element
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: hsl(var(--opposite) / 0.1); /* Use opposite with transparency */
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            // Ensure the button has relative positioning
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            
            // Append the ripple and remove it after the animation
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // --- Hide scroll indicator after scrolling down ---
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            // Fade out the indicator when the user scrolls past 100px
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    // --- Mobile menu hamburger animation ---
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (mobileDrawer.classList.contains('open')) {
                    // Reset to hamburger
                    span.style.transform = '';
                    span.style.opacity = '1';
                } else {
                    // Transform to X
                    if (index === 0) {
                        span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else if (index === 1) {
                        span.style.opacity = '0';
                    } else if (index === 2) {
                        span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    }
                }
            });
        });
    }

    // --- Auto-close drawer on window resize ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
            closeDrawerFn();
        }
    });

    // --- Prevent body scroll when drawer is open ---
    const originalBodyOverflow = document.body.style.overflow;
    
    function updateBodyScroll() {
        if (document.body.classList.contains('drawer-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = originalBodyOverflow;
        }
    }

    // Observer for body class changes
    const bodyObserver = new MutationObserver(updateBodyScroll);
    bodyObserver.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class'] 
    });

    // --- Enhanced scroll performance with throttling ---
    let ticking = false;
    
    function updateOnScroll() {
        // Navbar background
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'hsl(var(--primary) / 0.98)';
            } else {
                navbar.style.background = 'hsl(var(--primary) / 0.95)';
            }
        }
        
        // Scroll indicator
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    // Replace individual scroll listeners with throttled version
    window.addEventListener('scroll', requestTick);

    // --- Preload critical elements ---
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
        }
    });

    // --- Add loading states for buttons ---
    document.querySelectorAll('.btn[data-loading]').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                e.preventDefault();
                
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                this.style.opacity = '0.7';
                this.style.pointerEvents = 'none';
                
                // Simulate loading (remove this in production)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.opacity = '1';
                    this.style.pointerEvents = 'auto';
                }, 2000);
            }
        });
    });
});

// --- Service Worker Registration for PWA capabilities ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
