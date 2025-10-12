// Waitlist functionality
class WaitlistManager {
    constructor() {
        this.emailInputs = document.querySelectorAll('#email-input, #bottom-email-input');
        this.joinButtons = document.querySelectorAll('#join-waitlist, #bottom-join-waitlist');
        this.successMessages = document.querySelectorAll('#waitlist-success, #bottom-waitlist-success');
        
        this.init();
    }
    
    init() {
        this.joinButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.handleJoinWaitlist(index));
        });
        
        this.emailInputs.forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleJoinWaitlist(index);
                }
            });
        });
    }
    
    handleJoinWaitlist(index) {
        const email = this.emailInputs[index].value.trim();
        
        if (!this.validateEmail(email)) {
            this.showError(index, 'Please enter a valid email address');
            return;
        }
        
        // Simulate API call
        this.showLoading(index);
        
        setTimeout(() => {
            this.showSuccess(index);
            this.emailInputs[index].value = '';
            // Here you would typically send the email to your backend
            console.log('Email added to waitlist:', email);
        }, 1000);
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showLoading(index) {
        const button = this.joinButtons[index];
        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;
        button.dataset.originalText = originalText;
    }
    
    showSuccess(index) {
        const button = this.joinButtons[index];
        const message = this.successMessages[index];
        
        button.textContent = button.dataset.originalText;
        button.disabled = false;
        message.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
    
    showError(index, message) {
        // You could implement error display here
        console.error('Error:', message);
    }
}

// FAQ functionality
class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => this.toggleFAQ(item));
        });
    }
    
    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                this.observerOptions
            );
            
            this.observeElements();
        }
    }
    
    observeElements() {
        const elements = document.querySelectorAll('.feature-card, .demo-step, .use-less-text, .approach-text');
        elements.forEach(el => {
            el.classList.add('scroll-animate');
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }
}

// Demo step animation
class DemoAnimation {
    constructor() {
        this.demoSteps = document.querySelectorAll('.demo-step');
        this.currentStep = 0;
        this.init();
    }
    
    init() {
        if (this.demoSteps.length > 0) {
            this.startAnimation();
        }
    }
    
    startAnimation() {
        setInterval(() => {
            this.demoSteps.forEach(step => step.classList.remove('active'));
            this.demoSteps[this.currentStep].classList.add('active');
            this.currentStep = (this.currentStep + 1) % this.demoSteps.length;
        }, 3000);
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e, link));
        });
    }
    
    handleClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Update the existing NavbarScroll class
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = window.scrollY;
        this.heroSection = document.querySelector('.hero');
        this.emailInputSection = document.querySelector('.hero-cta');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > this.lastScrollY;
        const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
        
        // Only trigger animations if there's significant scroll movement (threshold)
        if (scrollDifference < 10) {
            return;
        }
        
        // Determine navbar state based on scroll position
        let shouldBeScrolled = currentScrollY > 100;
        let shouldBeHidden = false;
        
        // Show/hide based on scroll direction (only after initial 100px scroll)
        if (currentScrollY > 100) {
            if (isScrollingDown) {
                shouldBeHidden = true; // Show when scrolling up
            } else {
                shouldBeHidden = false; // Hide when scrolling down
            }
        }
        
        // Remove all state classes first
        this.navbar.classList.remove('scrolled', 'hide-up', 'show-down');
        
        // Apply new state
        if (shouldBeScrolled) {
            this.navbar.classList.add('scrolled');
            
            if (shouldBeHidden) {
                this.navbar.classList.add('hide-up');
            } else {
                this.navbar.classList.add('show-down');
            }
        } else {
            // Normal state (not scrolled)
            if (shouldBeHidden) {
                this.navbar.classList.add('hide-up');
            } else {
                this.navbar.classList.add('show-down');
            }
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images when they're added
        this.observeImages();
        
        // Preload critical resources
        this.preloadResources();
    }
    
    observeImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    preloadResources() {
        // Preload critical CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.as = 'style';
        criticalCSS.href = 'css/style.css';
        document.head.appendChild(criticalCSS);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WaitlistManager();
    new FAQManager();
    new ScrollAnimations();
    new DemoAnimation();
    new SmoothScroll();
    new NavbarScroll();
    new PerformanceOptimizer();
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Add loading states and error handling
window.addEventListener('load', () => {
    // Remove any loading indicators
    document.body.classList.add('loaded');
    
    // Add fade-in effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('fade-in-up');
    }
});

// Handle form submissions with proper error handling
document.addEventListener('submit', (e) => {
    e.preventDefault();
    // Handle form submissions here if needed
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes any open modals or dropdowns
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}