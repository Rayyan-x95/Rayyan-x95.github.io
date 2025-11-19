const backToTop = document.getElementById('backToTop');
const skillBars = document.querySelectorAll('.skill-bar-fill');
const bubbleToggle = document.getElementById('bubbleToggle');
const bubbleMenuItems = document.getElementById('bubbleMenuItems');
const menuBtn = document.querySelector('.menu-btn');

const SECTION_OFFSET = 100;
const SCROLL_THRESHOLD = 0.1;
const BACK_TO_TOP_TRIGGER = 300;

const lenis = new Lenis({
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80,
                duration: 1.5,
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    
    const tooltips = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltips);
    
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns);
    
    const sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);
    
    const parallax = document.querySelectorAll('.parallax');
    M.Parallax.init(parallax);
    
    const tabs = document.querySelectorAll('.tabs');
    M.Tabs.init(tabs);

    const materialbox = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(materialbox);
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin);

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const typingText = document.getElementById('typing-text');
if (typingText) {
    const roles = ["WEB DEVELOPER", "ANDROID DEV", "VIDEO EDITOR", "3D ARTIST"];
    let roleIndex = 0;
    
    const typeRole = () => {
        const role = roles[roleIndex];
        gsap.to(typingText, {
            duration: 1.5,
            text: role,
            ease: "none",
            onComplete: () => {
                gsap.delayedCall(2, () => {
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeRole();
                });
            }
        });
    };
    
    gsap.delayedCall(1, typeRole);
    
    gsap.to('.cursor', {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
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
                
                if (filterValue === 'all' || category === filterValue) {
                    gsap.to(card, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        display: 'block',
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        display: 'none',
                        ease: 'power2.in'
                    });
                }
            });
            
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });
    });
}

const sendBtn = document.getElementById('send-message-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                sendBtn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
                sendBtn.classList.add('green');
                
                M.toast({html: 'Message sent successfully!', classes: 'rounded green'});
                
                setTimeout(() => {
                    const modal = M.Modal.getInstance(document.getElementById('contact-modal'));
                    modal.close();
                    
                    document.querySelector('.contact-form').reset();
                    sendBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane right"></i>';
                    sendBtn.classList.remove('green');
                }, 1500);
            }, 1500);
        } else {
            M.toast({html: 'Please fill in all fields', classes: 'rounded red'});
        }
    });
}

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

const { animate: motionAnimate, inView, scroll: motionScroll } = Motion;

inView('.skill-bar', ({ target }) => {
    motionAnimate(
        target.querySelector('.skill-bar-fill'),
        { scaleX: [0, 1] },
        { duration: 1.5, easing: 'ease-out' }
    );
}, { amount: 0.5 });

motionScroll(
    motionAnimate('.parallax-layer', {
        transform: ['translateY(0px)', 'translateY(-100px)']
    }),
    { target: document.querySelector('.parallax-layer') }
);

const initCounterAnimations = () => {
    const animateCounter = (counter) => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        
        const target = +counter.getAttribute('data-count');
        const duration = 2000;
        const start = performance.now();
        const hasPlus = counter.textContent.includes('+');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
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
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    setTimeout(() => {
                        animateCounter(entry.target);
                    }, 100);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        allCounters.forEach(counter => {
            counterObserver.observe(counter);
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

if (bubbleToggle && bubbleMenuItems && menuBtn) {
    const closeBubbleMenu = () => {
        bubbleMenuItems.classList.remove('active');
        menuBtn.classList.remove('open');
        bubbleToggle.setAttribute('aria-expanded', 'false');
        bubbleMenuItems.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    bubbleToggle.addEventListener('click', () => {
        const isOpen = bubbleMenuItems.classList.toggle('active');
        menuBtn.classList.toggle('open');
        bubbleToggle.setAttribute('aria-expanded', isOpen);
        bubbleMenuItems.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    bubbleMenuItems.addEventListener('click', (e) => {
        const pillLink = e.target.closest('.pill-link');
        if (pillLink) {
            closeBubbleMenu();
        } else if (e.target === bubbleMenuItems) {
            closeBubbleMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bubbleMenuItems.classList.contains('active')) {
            closeBubbleMenu();
        }
    });
}

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
    
    lenis.on('scroll', updateActiveLink);
    
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
            
            const spotlight = el.querySelector('::before') || el;
            spotlight.style.setProperty('--spotlight-x', `${x}px`);
            spotlight.style.setProperty('--spotlight-y', `${y}px`);
            
            el.style.setProperty('--x', `${x}px`);
            el.style.setProperty('--y', `${y}px`);
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
    
    lenis.on('scroll', ({ progress }) => {
        progressBar.style.transform = `scaleX(${progress})`;
    });
};

const initParallax = () => {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    lenis.on('scroll', ({ scroll }) => {
        parallaxLayers.forEach((layer) => {
            const speed = layer.dataset.speed || 0.5;
            const yPos = -(scroll * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    });
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
    lenis.on('scroll', ({ scroll }) => {
        backToTop.classList.toggle('visible', scroll > BACK_TO_TOP_TRIGGER);
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.5 });
    });
}
const observerOptions = {
    threshold: SCROLL_THRESHOLD,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

const revealElements = document.querySelectorAll('[data-animate]');

if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animate');
                const delay = element.getAttribute('data-delay') || 0;
                
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

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

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
});