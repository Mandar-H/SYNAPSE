// Synapse Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    const app = document.getElementById('app');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Load saved theme or default to dark
    let currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
    
    function applyTheme(theme) {
        if (theme === 'light') {
            app.classList.add('theme-light');
            themeIcon.textContent = '☾';
            themeText.textContent = 'Dark';
        } else {
            app.classList.remove('theme-light');
            themeIcon.textContent = '☀';
            themeText.textContent = 'Light';
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0) translate(0, 0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0) translate(0, 0)';
            }
        });
    });
    
    // Explore tools button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            const toolsSection = document.getElementById('tools');
            if (toolsSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = toolsSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Tool cards hover effects
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        const color = card.getAttribute('data-color');
        card.style.setProperty('--tool-color', color);
        
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#343b4f';
            if (currentTheme === 'dark') {
                this.style.background = '#191d28';
                this.style.boxShadow = '0 16px 30px rgba(0,0,0,.25)';
            } else {
                this.style.background = '#f8fafc';
                this.style.boxShadow = '0 16px 30px rgba(16,24,40,.10)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = currentTheme === 'dark' ? '#2f2f2f' : '#e5e8ef';
            this.style.background = currentTheme === 'dark' ? '#2d2d2d' : '#ffffff';
            this.style.boxShadow = 'none';
        });
    });
    
    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
            this.style.borderColor = '#343b4f';
            if (currentTheme === 'dark') {
                this.style.background = '#191d28';
                this.style.boxShadow = '0 16px 30px rgba(0,0,0,.25)';
            } else {
                this.style.background = '#f8fafc';
                this.style.boxShadow = '0 16px 30px rgba(16,24,40,.10)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.borderColor = currentTheme === 'dark' ? '#2f2f2f' : '#e5e8ef';
            this.style.background = currentTheme === 'dark' ? '#2d2d2d' : '#ffffff';
            this.style.boxShadow = currentTheme === 'dark' ? '0 10px 30px rgba(0,0,0,.35)' : '0 10px 30px rgba(16,24,40,.06)';
        });
    });
    
    // Help button functionality
    const helpToggle = document.getElementById('helpToggle');
    const helpDescBox = document.getElementById('helpDescBox');
    
    if (helpToggle && helpDescBox) {
        helpToggle.addEventListener('mouseenter', function() {
            helpDescBox.classList.add('show');
        });
        
        helpToggle.addEventListener('mouseleave', function() {
            helpDescBox.classList.remove('show');
        });
        
        // Add particle effect to help button
        helpToggle.addEventListener('click', function() {
            createParticles(this);
        });
    }
    
    // Particle effect for help button
    function createParticles(button) {
        const particleContainer = document.getElementById('particleContainer');
        if (!particleContainer) return;
        
        // Clear existing particles
        particleContainer.innerHTML = '';
        
        // Create particles
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = currentTheme === 'dark' ? '#007acc' : '#18a058';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            particle.style.opacity = '1';
            
            particleContainer.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { 
                    opacity: 1, 
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)` 
                },
                { 
                    opacity: 0, 
                    transform: `translate(-50%, -50%) translate(${x * 2}px, ${y * 2}px) scale(0)` 
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.tool-card, .step-card, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = currentTheme === 'dark' 
                ? 'rgba(11,12,16,.9)' 
                : 'rgba(255,255,255,.95)';
        } else {
            header.style.background = currentTheme === 'dark' 
                ? 'rgba(11,12,16,.6)' 
                : 'rgba(255,255,255,.85)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Button click animations (excluding signup buttons)
    const buttons = document.querySelectorAll('.btn:not(.signup-btn):not(.mobile-signup-btn):not(.cta-btn)');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize tool card colors
    toolCards.forEach(card => {
        const color = card.getAttribute('data-color');
        card.style.setProperty('--tool-color', color);
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    console.log('Synapse page initialized successfully!');
});
