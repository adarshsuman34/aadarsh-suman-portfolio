document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Allow the "Namaste World" animation to draw (approx ~2000ms total)
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800); // 800ms matches the CSS opacity transition
        }, 2200); 
    }

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Elements on Scroll
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    
    // Trigger initially
    setTimeout(revealOnScroll, 100);
    window.addEventListener('scroll', revealOnScroll);

    // 4. Canvas Matrix Rain Effect
    const canvas = document.getElementById('rain-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?01";
        const fontSize = 16;
        let columns = Math.floor(width / fontSize);
        let drops = [];
        
        // Initialize random starting points
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * height;
        }
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = Math.random() * height;
            }
        });

        function drawRain() {
            ctx.fillStyle = 'rgba(3, 3, 8, 0.15)'; 
            ctx.fillRect(0, 0, width, height);

            ctx.font = "bold " + fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                
                // Simulate the "animate-pulse" brighter text from React version
                if (Math.random() < 0.05) {
                    ctx.fillStyle = '#e0f7ff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00d2ff';
                } else {
                    ctx.fillStyle = 'rgba(0, 210, 255, 0.4)'; 
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i] += 0.5 + Math.random() * 0.5;
            }
            requestAnimationFrame(drawRain);
        }
        drawRain();
    }

    // 5. Text Scramble Logic
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    const scrambleEl = document.getElementById('scramble-title');
    if (scrambleEl) {
        const fx = new TextScramble(scrambleEl);
        const phrases = [
            'Hi, I am Aadarsh.',
            'Software Developer',
            'AI Enthusiast',
            'Let\'s Build!'
        ];
        
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 2000);
            });
            counter = (counter + 1) % phrases.length;
        };
        next();
    }

    // 5. Update Footer Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 6. Vanilla JS Tilt Effect for Certification Cards
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s ease';
            
            // Remove transition after it completes to allow smooth mousemove again
            setTimeout(() => {
                el.style.transition = '';
            }, 500);
        });
    });

    // 7. Contact Form AJAX Submission with Toast Notification
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const closeToast = document.querySelector('.close-toast');
    
    let toastTimer;
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if(response.ok) {
                    // Show Toast
                    toast.classList.add('active');
                    form.reset();
                    
                    // Hide Toast after 5 seconds exactly matching CSS animation
                    clearTimeout(toastTimer);
                    toastTimer = setTimeout(() => {
                        toast.classList.remove('active');
                    }, 5000);
                    
                } else {
                    alert('There was a problem submitting your form. Please try again later.');
                }
            }).catch(error => {
                alert('There was a problem submitting your form. Please try again later.');
            }).finally(() => {
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            });
        });
    }
    
    if (closeToast) {
        closeToast.addEventListener('click', () => {
            toast.classList.remove('active');
            clearTimeout(toastTimer);
        });
    }
});
