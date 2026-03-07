// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
    SCROLL_THRESHOLD: 0.15,
    COUNTER_DURATION: 1800,
    TYPING_PAUSE: 2500,
    THROTTLE_DELAY: 100
};

// Enable JS-dependent animations
document.documentElement.classList.add('js-enabled');

// ============================================
// THEME TOGGLE
// ============================================
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn) {
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        localStorage.setItem('theme', theme);
        
        // Update theme-color meta tag
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0b0f1a' : '#5b4cdb');
        }

        // Update GitHub stats images theme
        document.querySelectorAll('.github-stats-img').forEach(img => {
            const newTheme = theme === 'dark' ? 'tokyonight' : 'default';
            img.src = img.src.replace(/theme=[^&]+/, 'theme=' + newTheme);
            const source = img.closest('picture')?.querySelector('source');
            if (source) {
                source.srcset = source.srcset.replace(/theme=[^&]+/, 'theme=' + newTheme);
            }
        });
    };

    themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Initialize theme state on button (theme already set by critical inline script)
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeToggleBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
}

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
// PROJECT & GALLERY FILTERING
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const filterItems = document.querySelectorAll('.project-card, .gallery-item');

if (filterBtns.length && filterItems.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            filterItems.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                
                if (typeof gsap !== 'undefined') {
                    if (show) {
                        gsap.set(item, { display: '', clearProps: 'transform' });
                        gsap.fromTo(item, 
                            { opacity: 0, scale: 0.88, y: 30 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.5, 
                              ease: 'power3.out',
                              clearProps: 'opacity,transform' }
                        );
                    } else {
                        gsap.to(item, {
                            scale: 0.85,
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => { item.style.display = 'none'; }
                        });
                    }
                } else {
                    Object.assign(item.style, {
                        display: show ? 'block' : 'none',
                        opacity: show ? '1' : '0',
                        transform: show ? 'scale(1)' : 'scale(0.8)'
                    });
                }
            });
            
            if (typeof ScrollTrigger !== 'undefined') setTimeout(() => ScrollTrigger.refresh(), 500);
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

    // Allow submitting via Enter key on input fields
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                sendBtn.click();
            }
        });
    }

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

        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error', 'has-success'));

        if (!name) {
            nameInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        } else {
            nameInput.closest('.form-group')?.classList.add('has-success');
        }
        
        if (!email || !emailRegex.test(email)) {
            emailInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        } else {
            emailInput.closest('.form-group')?.classList.add('has-success');
        }
        
        if (!message) {
            messageInput.closest('.form-group')?.classList.add('has-error');
            isValid = false;
        } else {
            messageInput.closest('.form-group')?.classList.add('has-success');
        }

        if (!isValid) {
            return showNotification('Please check the highlighted fields', 'error');
        }
        
        const originalBtnContent = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        sendBtn.disabled = true;
        sendBtn.classList.add('disabled');
        
        // CoeffX Forms Integration — uses form action attribute
        try {
            const response = await fetch(form.action, {
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
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                    input.closest('.form-group')?.classList.remove('has-error', 'has-success');
                });
                
                setTimeout(() => {
                    sendBtn.innerHTML = originalBtnContent;
                    sendBtn.classList.remove('green', 'disabled');
                    sendBtn.disabled = false;
                }, 2000);
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
                form?.reset();
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                    input.closest('.form-group')?.classList.remove('has-error', 'has-success');
                });
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
        border-radius: 12px; z-index: 10000; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        transform: translateX(120%); opacity: 0;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
        font-weight: 500; backdrop-filter: blur(8px);
    `;
    document.body.appendChild(notification);
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    });
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// ============================================
// GSAP SCROLL ANIMATIONS
// ============================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Hero title entrance
    document.querySelector('.hero-title-stacked .hero-line-huge') && gsap.from('.hero-title-stacked .hero-line-huge', {
        opacity: 0, y: 100, rotationX: 15, duration: 1.2, stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.hero-title-stacked', start: 'top 80%' }
    });

    // Project cards stagger with 3D rotation
    document.querySelectorAll('.project-card').length && gsap.from('.project-card', {
        opacity: 0, y: 70, rotationY: 10, scale: 0.9, duration: 1.1, stagger: 0.12,
        ease: 'power3.out', transformOrigin: 'center center',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 85%' }
    });

    // Section titles — slide up
    document.querySelectorAll('.section-title-bold').forEach(title => {
        gsap.from(title, {
            opacity: 0, y: 50, duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: title, start: 'top 88%' }
        });
    });

    // Skill cards stagger
    document.querySelectorAll('.skill-card').length && gsap.from('.skill-card', {
        opacity: 0, y: 60, scale: 0.92, duration: 1, stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' }
    });

    // Timeline items — slide from left with stagger
    document.querySelectorAll('.timeline-item').length && gsap.from('.timeline-item', {
        opacity: 0, x: -60, duration: 0.9, stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.experience-timeline', start: 'top 82%' }
    });

    // Journey cards — cascade reveal
    document.querySelectorAll('.journey-card').length && gsap.from('.journey-card', {
        opacity: 0, y: 80, rotationX: 8, scale: 0.94, duration: 1.1, stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.journey-grid', start: 'top 82%' }
    });

    // Showcase minimal cards — scale up
    document.querySelectorAll('.minimal-card').length && gsap.from('.minimal-card', {
        opacity: 0, scale: 0.85, y: 40, duration: 0.9, stagger: 0.1,
        ease: 'back.out(1.4)',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.showcase-grid', start: 'top 85%' }
    });

    // Stat cards — counter-style pop in
    document.querySelectorAll('.stat-card').length && gsap.from('.stat-card', {
        opacity: 0, scale: 0.8, y: 30, duration: 0.8, stagger: 0.08,
        ease: 'back.out(1.7)',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.about-stats-grid', start: 'top 85%' }
    });

    // Social cards — fan out from center
    document.querySelectorAll('.social-card').length && gsap.from('.social-card', {
        opacity: 0, y: 40, scale: 0.9, duration: 0.8, stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.social-cards-grid', start: 'top 85%' }
    });

    // GitHub stat cards
    document.querySelectorAll('.github-stat-card').length && gsap.from('.github-stat-card', {
        opacity: 0, y: 50, scale: 0.92, duration: 0.9, stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.github-stats-grid', start: 'top 85%' }
    });

    // Contact section — info panel slides from left, form from right
    const contactInfo = document.querySelector('.contact-info-panel');
    const contactForm = document.querySelector('.contact-form-panel');
    if (contactInfo && contactForm) {
        gsap.from(contactInfo, {
            opacity: 0, x: -60, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' }
        });
        gsap.from(contactForm, {
            opacity: 0, x: 60, duration: 1, delay: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' }
        });
    }

    // Parallax blobs — subtle float on scroll
    document.querySelectorAll('.blob').forEach((blob, i) => {
        gsap.to(blob, {
            y: () => (i % 2 === 0 ? -80 : 80),
            ease: 'none',
            scrollTrigger: {
                trigger: blob.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    });

    // Statement section — parallax text
    const statementText = document.querySelector('.statement-text');
    if (statementText) {
        gsap.from(statementText, {
            opacity: 0, y: 60, scale: 0.96, duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: statementText, start: 'top 85%' }
        });
    }

    // Hero profile image ring spin-up on load
    const profileRing = document.querySelector('.hero-profile-ring');
    if (profileRing) {
        gsap.from(profileRing, {
            scale: 0.8, opacity: 0, rotation: -90, duration: 1.4,
            ease: 'power3.out', delay: 0.6
        });
    }

    // Hero metrics counter entrance
    document.querySelectorAll('.hero-metric').length && gsap.from('.hero-metric', {
        opacity: 0, y: 30, scale: 0.9, duration: 0.8, stagger: 0.1,
        ease: 'back.out(1.5)', delay: 0.8
    });

    // Testimonial stat cards entrance
    document.querySelectorAll('.testimonial-stat-card').length && gsap.from('.testimonial-stat-card', {
        opacity: 0, y: 50, scale: 0.9, duration: 1, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonial-stats-container', start: 'top 85%' }
    });

    // Testimonial grid items entrance
    document.querySelectorAll('.testimonial-card').length && gsap.from('.testimonial-card', {
        opacity: 0, y: 60, scale: 0.95, duration: 1.1, stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: '.testimonials-grid', start: 'top 82%' }
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
            gsap.fromTo(bar, 
                { scaleX: 0 },
                { scaleX: 1, duration: 1.8, ease: 'power3.out', transformOrigin: 'left',
                  onStart: () => { bar.style.opacity = '1'; } }
            );
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
        const duration = typeof CONFIG !== 'undefined' ? CONFIG.COUNTER_DURATION : 1800;
        let start = null;
        
        const updateCounter = (currentTime) => {
            if (!start) start = currentTime;
            const progress = Math.min((currentTime - start) / duration, 1);
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
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    const updateActiveLink = throttle(() => {
        const scrollY = window.pageYOffset;
        const isIndex = currentPath === 'index.html' || currentPath === '';
        
        let foundSection = false;
        if (isIndex) {
            document.querySelectorAll('section[id]').forEach(section => {
                const { offsetTop, offsetHeight, id } = section;
                if (scrollY >= offsetTop - 150 && scrollY < offsetTop - 150 + offsetHeight) {
                    foundSection = true;
                    landoNavLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === `#${id}` || href === `index.html#${id}`);
                    });
                }
            });
        }
        
        // If not on index or not in a section, highlight based on filename
        if (!foundSection) {
            landoNavLinks.forEach(link => {
                const href = link.getAttribute('href').split('#')[0];
                const isActive = href === currentPath || (currentPath === 'index.html' && href === '#home');
                link.classList.toggle('active', isActive);
            });
        }
    }, CONFIG.THROTTLE_DELAY);
    
    lenis ? lenis.on('scroll', updateActiveLink) : window.addEventListener('scroll', updateActiveLink);
    // Initial call
    updateActiveLink();
    
    landoNavLinks.forEach(link => {
        link.addEventListener('click', () => {
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
// Magnetic buttons handled by initEnhancedInteractions

const initTiltEffect = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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

// ============================================
// PREMIUM PARTICLE EFFECTS
// ============================================
const initParticleEffects = () => {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const startX = Math.random() * window.innerWidth;
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 12 + 12;
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
        setTimeout(() => particle.remove(), (duration + delay) * 1000);
    };
    
    // Reduced initial count for better perf
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 300);
    }
    
    // Slower continuous creation
    setInterval(createParticle, 4000);
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
                    preloader.style.transform = 'scale(1.05)';
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    preloader.style.filter = 'blur(10px)';
                    setTimeout(() => preloader.remove(), 600);
                }, 300);
            }, 400);
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
        
        // Hide when scrolled past hero section
        const heroHeight = document.querySelector('.hero-v9')?.offsetHeight || window.innerHeight;
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
    // Skip heavy interactive effects when reduced-motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Magnetic buttons with enhanced physics
    if (!prefersReducedMotion) {
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
    }
    
    // Enhanced card tilt effects with smooth spring-back
    if (!prefersReducedMotion) {
        document.querySelectorAll('.minimal-card, .social-card').forEach(card => {
        let tiltRAF;
        card.addEventListener('mousemove', (e) => {
            if (tiltRAF) cancelAnimationFrame(tiltRAF);
            tiltRAF = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
                card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(12px) scale(1.03)`;
                card.style.transition = 'transform 0.1s ease';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            if (tiltRAF) cancelAnimationFrame(tiltRAF);
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = '';
        });
    });
    }
};

// ============================================
// MICRO-INTERACTIONS
// ============================================
const initMicroInteractions = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ripple effect on CTA/primary buttons
    if (!prefersReducedMotion) {
        document.querySelectorAll('.cta-btn-primary, .cta-btn-secondary, .btn-primary, .btn-outline').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute; border-radius: 50%; pointer-events: none;
                width: 0; height: 0; left: ${x}px; top: ${y}px;
                background: rgba(255,255,255,0.35);
                transform: translate(-50%, -50%);
                animation: rippleExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    }

    // Form input focus — floating label feedback  
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('input-focused');
            if (typeof gsap !== 'undefined') {
                gsap.to(input, { borderColor: 'rgba(91, 76, 219, 0.5)', duration: 0.3, ease: 'power2.out' });
            }
        });
        input.addEventListener('blur', () => {
            input.parentElement?.classList.remove('input-focused');
            if (typeof gsap !== 'undefined') {
                gsap.to(input, { borderColor: '', duration: 0.3, ease: 'power2.out', clearProps: 'borderColor' });
            }
        });
    });

    // Smooth hover feedback for filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined' && !this.classList.contains('active')) {
                gsap.to(this, { scale: 1.06, duration: 0.25, ease: 'back.out(2)' });
            }
        });
        chip.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { scale: 1, duration: 0.2, ease: 'power2.out' });
            }
        });
    });
};

// ============================================
// CUSTOM CURSOR
// ============================================
const initCustomCursor = () => {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    // Don't init on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isVisible = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Use transform for GPU compositing instead of left/top
        dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
        if (!isVisible) {
            dot.classList.add('visible');
            ring.classList.add('visible');
            isVisible = true;
        }
    });

    // Smooth ring follow with GPU-composited transform
    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`;
        requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);

    // Hover state on interactive elements
    const interactiveSelectors = 'a, button, .magnetic-btn, .project-card, .minimal-card, .social-card, .action-bubble, .filter-btn, .logo-loop-item, input, textarea, .skill-card, .stat-card, .journey-card, .timeline-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('cursor-hover');
            ring.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('cursor-hover');
            ring.classList.remove('cursor-hover');
        });
    });

    // Click state
    document.addEventListener('mousedown', () => {
        dot.classList.add('cursor-click');
        ring.classList.add('cursor-click');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('cursor-click');
        ring.classList.remove('cursor-click');
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
        dot.classList.remove('visible');
        ring.classList.remove('visible');
        isVisible = false;
    });
    document.addEventListener('mouseenter', () => {
        dot.classList.add('visible');
        ring.classList.add('visible');
        isVisible = true;
    });
};

// ============================================
// INIT ALL PREMIUM FEATURES
// ============================================
const initPremiumFeatures = () => {
    initCustomCursor();
    initParticleEffects();
    initEnhancedPreloader();
    initScrollIndicator();
    initEnhancedTyping();
    initEnhancedInteractions();
    initMicroInteractions();
    initTiltEffect();
    initSpotlightEffect();
};

// Initialize when DOM is ready
document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', initPremiumFeatures)
    : initPremiumFeatures();





// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    // Always visible — no scroll-based toggling
    backToTop.classList.add('visible');

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

    // GitHub stats image loading skeleton
    document.querySelectorAll('.github-stats-img').forEach(img => {
        const card = img.closest('.github-stat-card');
        if (!card) return;
        const onLoad = () => { img.classList.add('loaded'); card.classList.add('loaded'); };
        img.complete ? onLoad() : img.addEventListener('load', onLoad);
        img.addEventListener('error', () => {
            // Show fallback UI on error
            card.classList.add('stats-error', 'loaded');
            if (!card.querySelector('.github-stats-fallback')) {
                const fallback = document.createElement('div');
                fallback.className = 'github-stats-fallback';
                fallback.innerHTML = '<i class="fab fa-github"></i><p>Stats temporarily unavailable</p><button class="retry-stats-btn" style="margin-top:0.5rem;padding:0.4rem 1rem;border:1px solid var(--border-color);border-radius:8px;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:0.8rem;">Retry</button>';
                card.appendChild(fallback);
                fallback.querySelector('.retry-stats-btn')?.addEventListener('click', () => {
                    card.classList.remove('stats-error');
                    img.src = img.src + '&retry=' + Date.now();
                });
            }
        });
    });

    // Testimonials GSAP animation
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.testimonial-card').length && gsap.from('.testimonial-card', {
            opacity: 0, y: 50, scale: 0.95, duration: 0.9, stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: '.testimonials-grid', start: 'top 85%' }
        });
    }

    // Auto-update copyright year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});