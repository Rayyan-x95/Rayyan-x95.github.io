// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
    SCROLL_THRESHOLD: 0.15,
    BACK_TO_TOP_TRIGGER: 300,
    COUNTER_DURATION: 1800,
    TYPING_PAUSE: 2500,
    THROTTLE_DELAY: 100
};

// Enable JS-dependent animations
document.documentElement.classList.add('js-enabled');

// ============================================
// LENIS SMOOTH SCROLL INITIALIZATION
// ============================================
const lenis = (() => {
    if (typeof Lenis === 'undefined') return null;
    // Enhanced error handling with fallback
    try {
        return new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
            wheelMultiplier: 0.8,
            touchMultiplier: 2
        });
    } catch (error) {
        console.warn('Lenis initialization failed, falling back to native scrolling:', error);
        return null;
    }
})();

// Enhanced smooth scroll with better error handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) {
            console.warn(`Target element not found: ${targetId}`);
            return;
        }
        
        e.preventDefault();
        
        try {
            if (lenis) {
                lenis.scrollTo(target, { offset: -80, duration: 1.5 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (error) {
            console.warn('Smooth scroll failed, using fallback:', error);
            target.scrollIntoView();
        }
    });
});

// ============================================
// MATERIALIZE INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof M === 'undefined') return;
    
    const initList = [
        ['.modal', M.Modal],
        ['.tooltipped', M.Tooltip],
        ['.dropdown-trigger', M.Dropdown],
        ['.sidenav', M.Sidenav],
        ['.parallax', M.Parallax],
        ['.tabs', M.Tabs],
        ['.materialboxed', M.Materialbox]
    ];
    
    initList.forEach(([selector, Component]) => {
        const els = document.querySelectorAll(selector);
        if (els.length) Component.init(els);
    });
});

// ============================================
// GSAP INTEGRATION
// ============================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ...(typeof ScrollToPlugin !== 'undefined' ? [ScrollToPlugin] : []));
    
    if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }
}

// ============================================
// TYPING EFFECT
// ============================================
// Removed duplicate typing effect code to prevent conflicts with initEnhancedTyping


// ============================================
// PROJECT FILTERING
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            projectCards.forEach(card => {
                const show = filter === 'all' || card.dataset.category === filter;
                
                if (typeof gsap !== 'undefined') {
                    if (show) {
                        gsap.set(card, { display: 'block' });
                        gsap.to(card, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.4,
                            ease: 'power2.out'
                        });
                    } else {
                        gsap.to(card, {
                            scale: 0.8,
                            opacity: 0,
                            duration: 0.4,
                            ease: 'power2.in',
                            onComplete: () => gsap.set(card, { display: 'none' })
                        });
                    }
                } else {
                    Object.assign(card.style, {
                        display: show ? 'block' : 'none',
                        opacity: show ? '1' : '0',
                        transform: show ? 'scale(1)' : 'scale(0.8)'
                    });
                }
            });
            
            typeof ScrollTrigger !== 'undefined' && setTimeout(ScrollTrigger.refresh, 500);
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================
const sendBtn = document.getElementById('send-message-btn');
if (sendBtn) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Real-time validation
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('invalid');
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
    });

    sendBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = document.querySelector('.contact-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        const name = nameInput?.value.trim();
        const email = emailInput?.value.trim();
        const message = messageInput?.value.trim();
        
        let isValid = true;

        if (!name) {
            nameInput.classList.add('invalid');
            isValid = false;
        }
        
        if (!email || !emailRegex.test(email)) {
            emailInput.classList.add('invalid');
            isValid = false;
        }
        
        if (!message) {
            messageInput.classList.add('invalid');
            isValid = false;
        }

        if (!isValid) {
            return showNotification('Please check the highlighted fields', 'error');
        }
        
        const originalBtnContent = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        sendBtn.classList.add('disabled');
        
        // Formspree Integration
        const FORMSPREE_ID = 'myzpekgq'; 
        
        try {
            if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
                throw new Error('Formspree ID not configured');
            }

            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });

            if (response.ok) {
                sendBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
                sendBtn.classList.remove('btn-primary-v9');
                sendBtn.classList.add('green');
                showNotification('Message sent successfully!', 'success');
                
                form.reset();
                inputs.forEach(input => input.classList.remove('valid', 'invalid'));
                
                setTimeout(() => {
                    const modal = document.getElementById('contact-modal');
                    M?.Modal?.getInstance(modal)?.close() ?? (modal.style.display = 'none');
                    
                    // Reset button state
                    setTimeout(() => {
                        sendBtn.innerHTML = originalBtnContent;
                        sendBtn.classList.remove('green', 'disabled');
                        sendBtn.classList.add('btn-primary-v9');
                        sendBtn.disabled = false;
                    }, 500);
                }, 1500);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.warn('Form submission failed, falling back to mailto:', error);
            
            // Fallback to mailto
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            window.location.href = `mailto:mmohammedrayyan0808@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            sendBtn.innerHTML = 'Opened Email Client <i class="fas fa-envelope"></i>';
            sendBtn.classList.add('green');
            showNotification('Opening your email client...', 'success');
            
            setTimeout(() => {
                const modal = document.getElementById('contact-modal');
                M?.Modal?.getInstance(modal)?.close() ?? (modal.style.display = 'none');
                form?.reset();
                inputs.forEach(input => input.classList.remove('valid', 'invalid'));
                
                sendBtn.innerHTML = originalBtnContent;
                sendBtn.classList.remove('green', 'disabled');
                sendBtn.disabled = false;
            }, 2000);
        }
    });
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type) {
    if (typeof M !== 'undefined' && M.toast) {
        M.toast({ html: message, classes: `rounded ${type === 'success' ? 'green' : 'red'}` });
        return;
    }
    
    const notification = Object.assign(document.createElement('div'), { textContent: message });
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
        border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelector('.hero-title-stacked .hero-line-huge') && gsap.from('.hero-title-stacked .hero-line-huge', {
        opacity: 0, y: 100, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.hero-title-stacked', start: 'top 80%' }
    });

    document.querySelectorAll('.project-card').length && gsap.from('.project-card', {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' }
    });
}

// ============================================
// UNIFIED INTERSECTION OBSERVER
// ============================================
const createObserver = (callback, options = {}) => {
    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' });
};

// Skill bars
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length) {
    const skillObserver = createObserver((bar) => {
        if (typeof gsap !== 'undefined') {
            gsap.to(bar, { scaleX: 1, duration: 1.5, ease: 'power2.out', transformOrigin: 'left' });
        } else {
            bar.style.cssText = 'transition: transform 1.5s ease-out; transform: scaleX(1);';
        }
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => skillObserver.observe(bar.closest('.skill-bar') || bar));
}

// ============================================
// COUNTER ANIMATIONS
// ============================================
const initCounterAnimations = () => {
    const parseCounterMeta = (counter) => {
        const original = counter.dataset.originalText || counter.textContent || '';
        counter.dataset.originalText = original.trim();

        const dataCount = parseFloat(counter.dataset.count);
        const textNumber = parseFloat((original.match(/[\d.,]+/) || ['0'])[0].replace(/,/g, ''));
        const target = Number.isFinite(dataCount) ? dataCount : (Number.isFinite(textNumber) ? textNumber : 0);

        const prefix = (original.match(/^[^\d]+/) || [''])[0];
        const suffix = (original.match(/[^0-9.,\s]+$/) || [''])[0];
        return { target, prefix, suffix };
    };

    const animateCounter = (counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        
        const { target, prefix, suffix } = parseCounterMeta(counter);
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const progress = Math.min((currentTime - start) / CONFIG.COUNTER_DURATION, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = Math.floor(eased * target).toLocaleString();
            counter.textContent = `${prefix}${value}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    const allCounters = document.querySelectorAll('.metric-number, .quick-stat-number, .stat-number');
    if (!allCounters.length) return;
    
    // Hero counters animate immediately
    document.querySelectorAll('.hero-metrics .metric-number').forEach((c, i) => 
        setTimeout(() => animateCounter(c), 600 + i * 100)
    );
    
    // Other counters use observer
    const counterObserver = createObserver((el) => setTimeout(() => animateCounter(el), 50), { rootMargin: '0px 0px -30px 0px' });
    allCounters.forEach(c => !c.closest('.hero-metrics') && counterObserver.observe(c));
};

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', () => setTimeout(initCounterAnimations, 300))
    : setTimeout(initCounterAnimations, 300);

// ============================================
// UTILITY FUNCTIONS
// ============================================
const debounce = (fn, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), wait);
    };
};

const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ============================================
// NAVIGATION
// ============================================
const landoNavLinks = document.querySelectorAll('.lando-nav-link');
const landoNavbar = document.querySelector('.lando-nav');
const landoMenuToggle = document.getElementById('landoMenuToggle');
const landoNavLinksContainer = document.getElementById('landoNavLinks');

if (landoNavbar) {
    window.addEventListener('scroll', throttle(() => {
        landoNavbar.classList.toggle('scrolled', window.pageYOffset > 50);
    }, CONFIG.THROTTLE_DELAY));
}

if (landoNavLinks.length) {
    const updateActiveLink = throttle(() => {
        const scrollY = window.pageYOffset;
        document.querySelectorAll('section[id]').forEach(section => {
            const { offsetTop, offsetHeight, id } = section;
            if (scrollY >= offsetTop - 150 && scrollY < offsetTop - 150 + offsetHeight) {
                landoNavLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, CONFIG.THROTTLE_DELAY);
    
    lenis ? lenis.on('scroll', updateActiveLink) : window.addEventListener('scroll', updateActiveLink);
    
    landoNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            landoNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            if (landoNavLinksContainer && window.innerWidth <= 1024) {
                landoNavLinksContainer.classList.remove('active');
                landoMenuToggle?.classList.remove('active');
                landoMenuToggle?.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

if (landoMenuToggle && landoNavLinksContainer) {
    landoMenuToggle.addEventListener('click', () => {
        const isActive = landoMenuToggle.classList.toggle('active');
        landoNavLinksContainer.classList.toggle('active');
        landoMenuToggle.setAttribute('aria-expanded', isActive);
        document.body.classList.toggle('menu-open');
    });
}

// ============================================
// INTERACTIVE EFFECTS
// ============================================
const initMagneticButtons = () => {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        let isAnimating = false;
        
        btn.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            isAnimating = true;
            
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.15;
            const deltaY = (e.clientY - centerY) * 0.15;
            
            requestAnimationFrame(() => {
                btn.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
                isAnimating = false;
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                btn.style.transform = '';
            });
        });
    });
};

const initTiltEffect = () => {
    document.querySelectorAll('.tilt-effect').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top) - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - (e.clientX - rect.left)) / 10;
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
    document.querySelectorAll('.spotlight').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = `${e.clientX - rect.left}px`;
            const y = `${e.clientY - rect.top}px`;
            el.style.setProperty('--spotlight-x', x);
            el.style.setProperty('--spotlight-y', y);
            el.style.setProperty('--x', x);
             el.style.setProperty('--y', y);
        });
        el.addEventListener('mouseleave', () => {
            ['--spotlight-x', '--spotlight-y', '--x', '--y'].forEach(p => el.style.removeProperty(p));
        });
    });
};

const initScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress') || 
        Object.assign(document.createElement('div'), { className: 'scroll-progress' });
    
    if (!document.querySelector('.scroll-progress')) document.body.appendChild(progressBar);
    
    const update = lenis 
        ? ({ progress }) => progressBar.style.transform = `scaleX(${progress})`
        : () => progressBar.style.transform = `scaleX(${window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)})`;
    
    lenis ? lenis.on('scroll', update) : window.addEventListener('scroll', update);
};

const initParallax = () => {
    const layers = document.querySelectorAll('.parallax-layer');
    if (!layers.length) return;
    
    const update = (scroll) => layers.forEach(l => 
        l.style.transform = `translateY(${-(scroll * (parseFloat(l.dataset.speed) || 0.5))}px)`
    );
    
    lenis ? lenis.on('scroll', ({ scroll }) => update(scroll)) : window.addEventListener('scroll', () => update(window.scrollY));
};

// ============================================
// PREMIUM PARTICLE EFFECTS
// ============================================
const initParticleEffects = () => {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and properties
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            left: ${startX}px;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            background: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    };
    
    // Create initial particles
    for (let i = 0; i < 20; i++) {
        setTimeout(createParticle, i * 200);
    }
    
    // Continuously create new particles
    setInterval(createParticle, 2000);
};

// ============================================
// ENHANCED PRELOADER
// ============================================
const initEnhancedPreloader = () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('loaderProgress');
    
    if (!preloader) return;
    
    let progress = 0;
    const increment = () => {
        progress += Math.random() * 3 + 1;
        if (progress > 100) progress = 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.documentElement.classList.add('loaded-complete');
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    setTimeout(() => preloader.remove(), 500);
                }, 300);
            }, 500);
        } else {
            requestAnimationFrame(increment);
        }
    };
    
    requestAnimationFrame(increment);
    
    // Fallback for window load
    window.addEventListener('load', () => {
        progress = 100;
        if (progressBar) progressBar.style.width = '100%';
    });
};

// ============================================
// SCROLL INDICATOR
// ============================================
const initScrollIndicator = () => {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;
    
    const updateIndicator = () => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Hide when scrolled past hero section
        const heroHeight = document.querySelector('.hero-v9')?.offsetHeight || windowHeight;
        indicator.style.opacity = scrollY > heroHeight * 0.5 ? '0' : '0.7';
    };
    
    const scrollHandler = lenis 
        ? () => lenis.on('scroll', updateIndicator)
        : () => window.addEventListener('scroll', updateIndicator);
    
    scrollHandler();
    
    // Click to scroll to next section
    indicator.addEventListener('click', () => {
        const nextSection = document.querySelector('#about');
        if (nextSection) {
            lenis 
                ? lenis.scrollTo(nextSection, { offset: -80, duration: 1.5 })
                : nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
};

// ============================================
// ENHANCED TYPING EFFECT
// ============================================
const initEnhancedTyping = () => {
    const typingText = document.getElementById('typing-text');
    const cursor = document.querySelector('.cursor');
    
    if (!typingText) return;
    
    const roles = [
        "WEB DEVELOPER", 
        "UI/UX DESIGNER", 
        "ANDROID DEV", 
        "VIDEO EDITOR", 
        "3D ARTIST", 
        "PYTHON DEV", 
        "REACT EXPERT", 
        "CONTENT CREATOR", 
        "FREELANCER",
        "CREATIVE TECH"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    const typeRole = () => {
        if (isPaused) {
            isPaused = false;
            setTimeout(typeRole, 100);
            return;
        }
        
        const currentRole = roles[roleIndex];
        
        if (!isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                isDeleting = true;
                isPaused = true;
                cursor?.classList.add('cursor-blink');
                setTimeout(typeRole, CONFIG.TYPING_PAUSE);
                return;
            }
        } else {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                cursor?.classList.remove('cursor-blink');
            }
        }
        
        const typeSpeed = isDeleting ? 40 : 80 + Math.random() * 50;
        setTimeout(typeRole, typeSpeed);
    };
    
    // Add cursor animation
    if (cursor) {
        cursor.classList.add('cursor-animated');
    }
    
    // Start typing after a short delay
    setTimeout(typeRole, 500);
};

// ============================================
// ENHANCED INTERACTIONS
// ============================================
const initEnhancedInteractions = () => {
    // Magnetic buttons with enhanced physics
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        let isAnimating = false;
        let currentX = 0;
        let currentY = 0;
        
        btn.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            isAnimating = true;
            
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const targetX = (e.clientX - centerX) * 0.15;
            const targetY = (e.clientY - centerY) * 0.15;
            
            // Smooth transition to target position
            const animate = () => {
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
                
                btn.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.02)`;
                
                if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
                    requestAnimationFrame(animate);
                } else {
                    isAnimating = false;
                }
            };
            
            requestAnimationFrame(animate);
        });
        
        btn.addEventListener('mouseleave', () => {
            const resetAnimation = () => {
                currentX *= 0.8;
                currentY *= 0.8;
                
                btn.style.transform = `translate(${currentX}px, ${currentY}px) scale(1)`;
                
                if (Math.abs(currentX) > 0.1 || Math.abs(currentY) > 0.1) {
                    requestAnimationFrame(resetAnimation);
                } else {
                    btn.style.transform = '';
                    currentX = 0;
                    currentY = 0;
                }
            };
            
            requestAnimationFrame(resetAnimation);
        });
    });
    
    // Enhanced card tilt effects
    document.querySelectorAll('.minimal-card, .social-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
            
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
};

// ============================================
// INIT ALL PREMIUM FEATURES
// ============================================
const initPremiumFeatures = () => {
    initParticleEffects();
    initEnhancedPreloader();
    initScrollIndicator();
    initEnhancedTyping();
    initEnhancedInteractions();
    initTiltEffect();
    initSpotlightEffect();
};

// Initialize when DOM is ready
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initPremiumFeatures)
    : initPremiumFeatures();



// Remove duplicate initialization
const initModernEffects = () => {
    // All premium effects are now handled by initPremiumFeatures()
    // This function is kept for compatibility but no longer needed
};

// ============================================
// CURSOR ANIMATIONS
// ============================================
const cursorStyles = `
.cursor-animated {
    animation: cursorBlink 1s infinite;
}

.cursor-blink {
    animation: cursorBlink 0.5s infinite;
}

@keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}
`;

// Inject cursor styles
const styleSheet = document.createElement('style');
styleSheet.textContent = cursorStyles;
document.head.appendChild(styleSheet);

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    const updateBackToTop = (scroll) => backToTop.classList.toggle('visible', scroll > CONFIG.BACK_TO_TOP_TRIGGER);
    
    lenis 
        ? lenis.on('scroll', ({ scroll }) => updateBackToTop(scroll))
        : window.addEventListener('scroll', () => updateBackToTop(window.scrollY));

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        lenis ? lenis.scrollTo(0, { duration: 1.5 }) : window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// REVEAL ANIMATIONS (Unified Observer)
// ============================================
const revealElements = document.querySelectorAll('[data-animate]');
if (revealElements.length) {
    const revealObserver = createObserver((el) => {
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('reveal-active', `reveal-${el.dataset.animate}`), delay);
    }, { rootMargin: '0px 0px -80px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// ============================================
// DOM READY ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Logo track animation pause/play
    const logoTrack = document.querySelector('.logo-loop-track');
    if (logoTrack) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => logoTrack.style.animationPlayState = e.isIntersecting ? 'running' : 'paused');
        });
        logoObserver.observe(logoTrack);
    }
    
    // Reveal stagger and fade-up animations using unified observer
    const addInView = (el) => requestAnimationFrame(() => el.classList.add('in-view'));
    
    const staggerObserver = createObserver(addInView, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal-stagger').forEach(el => staggerObserver.observe(el));
    
    const fadeUpObserver = createObserver(addInView, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal-fade-up').forEach(el => fadeUpObserver.observe(el));
    
    // Lazy image loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.complete ? img.classList.add('loaded') : img.addEventListener('load', () => img.classList.add('loaded'));
    });
});