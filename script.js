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
    try {
        return new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: false,
        });
    } catch {
        return null;
    }
})();

// ============================================
// SMOOTH SCROLL ANCHORS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        lenis 
            ? lenis.scrollTo(target, { offset: -80, duration: 1.5 })
            : target.scrollIntoView({ behavior: 'smooth' });
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
const typingText = document.getElementById('typing-text');
if (typingText) {
    const roles = ["WEB DEVELOPER", "UI/UX DESIGNER", "ANDROID DEV", "VIDEO EDITOR", "3D ARTIST", "PYTHON DEV", "REACT EXPERT", "CONTENT CREATOR", "FREELANCER"];
    let roleIndex = 0, charIndex = 0, isDeleting = false;
    
    const typeRole = () => {
        const currentRole = roles[roleIndex];
        charIndex += isDeleting ? -1 : 1;
        typingText.textContent = currentRole.substring(0, charIndex);
        
        let typeSpeed = isDeleting ? 40 : 80 + Math.random() * 50;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = CONFIG.TYPING_PAUSE;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400;
        }
        
        setTimeout(typeRole, typeSpeed);
    };
    
    typeRole();
    document.querySelector('.cursor')?.classList.add('cursor-animated');
}

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
                    gsap.to(card, {
                        scale: show ? 1 : 0.8,
                        opacity: show ? 1 : 0,
                        duration: 0.4,
                        display: show ? 'block' : 'none',
                        ease: show ? 'power2.out' : 'power2.in'
                    });
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
    
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.querySelector('.contact-form');
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        
        if (!name || !email || !message) {
            return showNotification('Please fill in all fields', 'error');
        }
        if (!emailRegex.test(email)) {
            return showNotification('Please enter a valid email address', 'error');
        }
        
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            sendBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
            sendBtn.classList.add('green');
            showNotification('Message sent successfully!', 'success');
            
            setTimeout(() => {
                const modal = document.getElementById('contact-modal');
                M?.Modal?.getInstance(modal)?.close() ?? (modal.style.display = 'none');
                form?.reset();
                sendBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane right"></i>';
                sendBtn.classList.remove('green');
                sendBtn.disabled = false;
            }, 1500);
        }, 1500);
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
    const animateCounter = (counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        
        const target = +counter.dataset.count;
        const start = performance.now();
        const hasPlus = counter.textContent.includes('+');
        
        const updateCounter = (currentTime) => {
            const progress = Math.min((currentTime - start) / CONFIG.COUNTER_DURATION, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            counter.textContent = Math.floor(eased * target) + (hasPlus ? '+' : '');
            
            progress < 1 ? requestAnimationFrame(updateCounter) : (counter.textContent = target + (hasPlus ? '+' : ''));
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
            }
        });
    });
}

if (landoMenuToggle && landoNavLinksContainer) {
    landoMenuToggle.addEventListener('click', () => {
        const isActive = landoMenuToggle.classList.toggle('active');
        landoNavLinksContainer.classList.toggle('active');
        landoMenuToggle.setAttribute('aria-expanded', isActive);
    });
}

// ============================================
// INTERACTIVE EFFECTS
// ============================================
const initMagneticButtons = () => {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
            btn.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = '');
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

const initModernEffects = () => {
    initMagneticButtons();
    initTiltEffect();
    initSpotlightEffect();
    initScrollProgress();
    initParallax();
};

document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initModernEffects) 
    : initModernEffects();

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