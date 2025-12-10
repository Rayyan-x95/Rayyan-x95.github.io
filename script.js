// DOM Elements - with null checks
const backToTop = document.getElementById('backToTop');

const SECTION_OFFSET = 100;
const SCROLL_THRESHOLD = 0.15;
const BACK_TO_TOP_TRIGGER = 300;

// Enable JS-dependent animations - elements visible by default, animated when JS loads
document.documentElement.classList.add('js-enabled');

// Initialize Lenis with error handling
let lenis;
try {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
    }
} catch (e) {
    // Lenis initialization failed - fallback to native smooth scroll
    // Silent fail in production
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            if (lenis) {
                lenis.scrollTo(targetElement, {
                    offset: -80,
                    duration: 1.5,
                });
            } else {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components only if Materialize is loaded
    if (typeof M !== 'undefined') {
        try {
            const elems = document.querySelectorAll('.modal');
            if (elems.length > 0) M.Modal.init(elems);
            
            const tooltips = document.querySelectorAll('.tooltipped');
            if (tooltips.length > 0) M.Tooltip.init(tooltips);
            
            const dropdowns = document.querySelectorAll('.dropdown-trigger');
            if (dropdowns.length > 0) M.Dropdown.init(dropdowns);
            
            const sidenav = document.querySelectorAll('.sidenav');
            if (sidenav.length > 0) M.Sidenav.init(sidenav);
            
            const parallax = document.querySelectorAll('.parallax');
            if (parallax.length > 0) M.Parallax.init(parallax);
            
            const tabs = document.querySelectorAll('.tabs');
            if (tabs.length > 0) M.Tabs.init(tabs);

            const materialbox = document.querySelectorAll('.materialboxed');
            if (materialbox.length > 0) M.Materialbox.init(materialbox);
        } catch (e) {
            // Materialize initialization failed - continue without it
        }
    }
});

// Register GSAP plugins only if GSAP is available
if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    }
}

if (lenis && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
}

const typingText = document.getElementById('typing-text');
if (typingText) {
    const roles = [
        "WEB DEVELOPER",
        "UI/UX DESIGNER",
        "ANDROID DEV",
        "VIDEO EDITOR",
        "3D ARTIST",
        "PYTHON DEV",
        "REACT EXPERT",
        "CONTENT CREATOR",
        "FREELANCER"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeRole = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Varying speeds for natural feel
        let typeSpeed = isDeleting ? 40 : 80 + Math.random() * 50;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2500; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400; // Pause before next word
        }
        
        setTimeout(typeRole, typeSpeed);
    };
    
    typeRole();
    
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        // Add enhanced cursor class
        cursor.classList.add('cursor-animated');
    }
}

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || category === filterValue;
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        scale: shouldShow ? 1 : 0.8,
                        opacity: shouldShow ? 1 : 0,
                        duration: 0.4,
                        display: shouldShow ? 'block' : 'none',
                        ease: shouldShow ? 'power2.out' : 'power2.in'
                    });
                } else {
                    // Fallback without GSAP
                    card.style.display = shouldShow ? 'block' : 'none';
                    card.style.opacity = shouldShow ? '1' : '0';
                    card.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
                }
            });
            
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 500);
            }
        });
    });
}

const sendBtn = document.getElementById('send-message-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        if (!nameInput || !emailInput || !messageInput) return;
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            sendBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
            sendBtn.classList.add('green');
            showNotification('Message sent successfully!', 'success');
            
            setTimeout(() => {
                const modal = document.getElementById('contact-modal');
                if (typeof M !== 'undefined' && M.Modal) {
                    const modalInstance = M.Modal.getInstance(modal);
                    if (modalInstance) modalInstance.close();
                } else {
                    modal.style.display = 'none';
                }
                
                const form = document.querySelector('.contact-form');
                if (form) form.reset();
                
                sendBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane right"></i>';
                sendBtn.classList.remove('green');
                sendBtn.disabled = false;
            }, 1500);
        }, 1500);
    });
}

// Simple notification function (fallback if Materialize toast not available)
function showNotification(message, type) {
    if (typeof M !== 'undefined' && M.toast) {
        const classes = type === 'success' ? 'rounded green' : 'rounded red';
        M.toast({html: message, classes: classes});
    } else {
        // Fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// GSAP animations - only if GSAP is loaded
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const heroTitle = document.querySelector('.hero-title-stacked .hero-line-huge');
    if (heroTitle) {
        gsap.from('.hero-title-stacked .hero-line-huge', {
            opacity: 0,
            y: 100,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.hero-title-stacked',
                start: 'top 80%',
            }
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        gsap.from('.project-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.projects-grid',
                start: 'top 80%',
            }
        });
    }
}

// Skill bar animations using GSAP or CSS
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length > 0) {
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width || bar.getAttribute('data-width') || '0%';
                
                if (typeof gsap !== 'undefined') {
                    gsap.to(bar, {
                        scaleX: 1,
                        duration: 1.5,
                        ease: 'power2.out',
                        transformOrigin: 'left'
                    });
                } else {
                    // Fallback CSS animation
                    bar.style.transition = 'transform 1.5s ease-out';
                    bar.style.transform = 'scaleX(1)';
                }
                
                skillBarObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        const container = bar.closest('.skill-bar');
        if (container) {
            skillBarObserver.observe(container);
        } else {
            skillBarObserver.observe(bar);
        }
    });
}

const initCounterAnimations = () => {
    const animateCounter = (counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        
        const target = +counter.getAttribute('data-count');
        const duration = 1800; // Slightly faster animation
        const start = performance.now();
        const hasPlus = counter.textContent.includes('+');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smoother easeOutExpo curve
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(easeOutExpo * target);
            
            counter.textContent = hasPlus ? current + '+' : current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = hasPlus ? target + '+' : target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    const allCounters = document.querySelectorAll('.metric-number, .quick-stat-number, .stat-number');
    
    if (allCounters && allCounters.length > 0) {
        // Animate hero counters immediately (they're above the fold)
        const heroCounters = document.querySelectorAll('.hero-metrics .metric-number');
        heroCounters.forEach((counter, index) => {
            setTimeout(() => animateCounter(counter), 600 + (index * 100));
        });
        
        // Use IntersectionObserver for other counters
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    setTimeout(() => {
                        animateCounter(entry.target);
                    }, 50);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        });

        allCounters.forEach(counter => {
            // Skip hero counters, they're handled above
            if (!counter.closest('.hero-metrics')) {
                counterObserver.observe(counter);
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initCounterAnimations, 300);
    });
} else {
    setTimeout(initCounterAnimations, 300);
}

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};


const landoNavLinks = document.querySelectorAll('.lando-nav-link');
const landoNavbar = document.querySelector('.lando-nav');
const landoMenuToggle = document.getElementById('landoMenuToggle');
const landoNavLinksContainer = document.getElementById('landoNavLinks');

if (landoNavbar) {
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 50) {
            landoNavbar.classList.add('scrolled');
        } else {
            landoNavbar.classList.remove('scrolled');
        }
    }, 100));
}

if (landoNavLinks.length > 0) {
    const updateActiveLink = throttle(() => {
        const scrollY = window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                landoNavLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100);
    
    if (lenis) {
        lenis.on('scroll', updateActiveLink);
    } else {
        window.addEventListener('scroll', updateActiveLink);
    }
    
    landoNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            landoNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (landoNavLinksContainer && window.innerWidth <= 1024) {
                landoNavLinksContainer.classList.remove('active');
                if (landoMenuToggle) {
                    landoMenuToggle.classList.remove('active');
                    landoMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
}

if (landoMenuToggle && landoNavLinksContainer) {
    landoMenuToggle.addEventListener('click', () => {
        landoMenuToggle.classList.toggle('active');
        landoNavLinksContainer.classList.toggle('active');
        const expanded = landoMenuToggle.classList.contains('active');
        landoMenuToggle.setAttribute('aria-expanded', expanded);
    });
}

const initMagneticButtons = () => {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
};

const initTiltEffect = () => {
    const tiltElements = document.querySelectorAll('.tilt-effect');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            el.style.setProperty('--tilt-x', `${rotateX}deg`);
            el.style.setProperty('--tilt-y', `${rotateY}deg`);
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        });
    });
};

const initSpotlightEffect = () => {
    const spotlightElements = document.querySelectorAll('.spotlight');
    
    spotlightElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set CSS custom properties directly on element (::before pseudo-element will inherit)
            el.style.setProperty('--spotlight-x', `${x}px`);
            el.style.setProperty('--spotlight-y', `${y}px`);
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.removeProperty('--spotlight-x');
            el.style.removeProperty('--spotlight-y');
            el.style.removeProperty('--x');
            el.style.removeProperty('--y');
        });
    });
};

const initScrollProgress = () => {
    let progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }
    
    if (lenis) {
        lenis.on('scroll', ({ progress }) => {
            progressBar.style.transform = `scaleX(${progress})`;
        });
    } else {
        window.addEventListener('scroll', () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY / scrollable;
            progressBar.style.transform = `scaleX(${scrolled})`;
        });
    }
};

const initParallax = () => {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    if (parallaxLayers.length === 0) return;
    
    const updateParallax = (scroll) => {
        parallaxLayers.forEach((layer) => {
            const speed = parseFloat(layer.dataset.speed) || 0.5;
            const yPos = -(scroll * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    };
    
    if (lenis) {
        lenis.on('scroll', ({ scroll }) => updateParallax(scroll));
    } else {
        window.addEventListener('scroll', () => updateParallax(window.scrollY));
    }
};

const initModernEffects = () => {
    initMagneticButtons();
    initTiltEffect();
    initSpotlightEffect();
    initScrollProgress();
    initParallax();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModernEffects);
} else {
    initModernEffects();
}

if (backToTop) {
    const updateBackToTop = (scroll) => {
        backToTop.classList.toggle('visible', scroll > BACK_TO_TOP_TRIGGER);
    };
    
    if (lenis) {
        lenis.on('scroll', ({ scroll }) => updateBackToTop(scroll));
    } else {
        window.addEventListener('scroll', () => updateBackToTop(window.scrollY));
    }

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.5 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Animation observer options
const observerOptions = {
    threshold: SCROLL_THRESHOLD,
    rootMargin: '0px 0px -100px 0px'
};

const revealElements = document.querySelectorAll('[data-animate]');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animate');
                const delay = parseInt(element.getAttribute('data-delay') || 0, 10);
                
                setTimeout(() => {
                    element.classList.add('reveal-active', `reveal-${animationType}`);
                }, delay);
                
                revealObserver.unobserve(element);
            }
        });
    }, {
        threshold: SCROLL_THRESHOLD,
        rootMargin: '0px 0px -80px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
    const logoTrack = document.querySelector('.logo-loop-track');
    if (logoTrack) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    logoTrack.style.animationPlayState = 'running';
                } else {
                    logoTrack.style.animationPlayState = 'paused';
                }
            });
        });
        logoObserver.observe(logoTrack);
    }
    
    // Reveal stagger animations
    const staggerElements = document.querySelectorAll('.reveal-stagger');
    if (staggerElements.length > 0) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay to ensure smooth rendering
                    requestAnimationFrame(() => {
                        entry.target.classList.add('in-view');
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
        
        staggerElements.forEach(el => staggerObserver.observe(el));
    }
    
    // Reveal fade-up animations
    const fadeUpElements = document.querySelectorAll('.reveal-fade-up');
    if (fadeUpElements.length > 0) {
        const fadeUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('in-view');
                    });
                    fadeUpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
        
        fadeUpElements.forEach(el => fadeUpObserver.observe(el));
    }
    
    // Lazy image loading with fade effect
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
});