document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // Lenis Smooth Scroll Initialization
    // -------------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // EaseOutExpo
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement);
            }
        });
    });

    // Handle initial load with hash in URL
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                lenis.scrollTo(target, { immediate: false });
            }
        }, 150);
    }

    // -------------------------------------------------------------
    // Space Background (Stars & Shooting Stars Canvas Animation)
    // -------------------------------------------------------------
    const canvas = document.getElementById('space-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let shootingStars = [];
        const maxStars = 1000;
        
        // Handle resizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            for (let i = 0; i < maxStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.2,
                    brightness: Math.random(),
                    speed: 0.005 + Math.random() * 0.01
                });
            }
        };

        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width * 0.8;
                this.y = Math.random() * canvas.height * 0.3;
                this.length = 80 + Math.random() * 120;
                this.speed = 8 + Math.random() * 12;
                this.angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // Diagonal down-right (approx 30-45 deg)
                this.opacity = 1;
                this.fadeSpeed = 0.015 + Math.random() * 0.015;
            }

            update() {
                // Move diagonally
                const dx = Math.cos(this.angle) * this.speed;
                const dy = Math.sin(this.angle) * this.speed;
                this.x += dx;
                this.y += dy;
                this.opacity -= this.fadeSpeed;
            }

            draw() {
                if (this.opacity <= 0) return;
                
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // Draw star trail
                const grad = ctx.createLinearGradient(
                    this.x, this.y, 
                    this.x - Math.cos(this.angle) * this.length, 
                    this.y - Math.sin(this.angle) * this.length
                );
                grad.addColorStop(0, '#00f3ff');
                grad.addColorStop(0.3, '#9d4edd');
                grad.addColorStop(1, 'transparent');
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(
                    this.x - Math.cos(this.angle) * this.length, 
                    this.y - Math.sin(this.angle) * this.length
                );
                ctx.stroke();
                
                // Draw bright star head
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00f3ff';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Spawn shooting stars (maintain 1-2 active at any time)
        const spawnShootingStar = () => {
            if (shootingStars.length < 2 && Math.random() < 0.003) {
                shootingStars.push(new ShootingStar());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw static background stars (glowing/twinkling)
            for (let star of stars) {
                star.brightness += star.speed;
                if (star.brightness > 1 || star.brightness < 0) {
                    star.speed = -star.speed;
                }
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(star.brightness, 0.85)})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }

            // Update & Draw active shooting stars
            spawnShootingStar();
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                ss.update();
                ss.draw();
                if (ss.opacity <= 0) {
                    shootingStars.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // -------------------------------------------------------------
    // Navigation Section Tracking (Active nav highlights on scroll)
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the active view
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // -------------------------------------------------------------
    // Mobile Navigation Toggle
    // -------------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            const isActive = navLinksList.classList.contains('active');
            menuToggle.innerHTML = isActive ? '&#x2715;' : '&#x2630;'; // Toggle between burger and cross
        });

        // Close menu when link clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksList.classList.remove('active');
                menuToggle.innerHTML = '&#x2630;';
            });
        });
    }

    // -------------------------------------------------------------
    // Mouse Hover Light Tracking Effect (Square Cards)
    // -------------------------------------------------------------
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // -------------------------------------------------------------
    // Interactive Project Category Filtering
    // -------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0 && cards.length > 0) {
        // Initialize: Show only default active category (Board Games)
        const activeTab = document.querySelector('.tab-btn.active');
        const defaultFilter = activeTab ? activeTab.getAttribute('data-filter') : 'board-games';
        
        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (category !== defaultFilter) {
                card.classList.add('fade-out', 'hidden');
            }
        });

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('active')) return;
                
                // Toggle active state
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (category === filter) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.classList.remove('fade-out');
                        }, 50);
                    } else {
                        card.classList.add('fade-out');
                        setTimeout(() => {
                            if (card.classList.contains('fade-out')) {
                                card.classList.add('hidden');
                            }
                        }, 400); // Match CSS transition duration (0.4s)
                    }
                });
            });
        });
    }

    // -------------------------------------------------------------
    // Reveal On Scroll Animation
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    // -------------------------------------------------------------
    // Typewriter Effect for Hero Title Subheading
    // -------------------------------------------------------------
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const words = ["Game Designer", "Level Designer", "Game Systems Architect", "Gameplay Balancing", "Concept Designer"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before typing next word
            }

            setTimeout(type, typeSpeed);
        };

        setTimeout(type, 800);
    }
});
