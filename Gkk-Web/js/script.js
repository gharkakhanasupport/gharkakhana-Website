// =========================================
// GHAR KA KHANA - Main JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initContactForm();
});

// ===== Mobile Sidebar Toggle =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const sidebarClose = document.querySelector('.sidebar-close');

    if (!menuToggle || !sidebar || !overlay) return;

    // Function to open sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.classList.add('sidebar-open');

        // Animate hamburger to X
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    }

    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('sidebar-open');

        // Reset hamburger
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    // Toggle sidebar on hamburger click
    menuToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeSidebar);

    // Close on close button click
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Close sidebar when clicking on a link
    sidebar.querySelectorAll('.sidebar-link, .sidebar-cta').forEach(link => {
        link.addEventListener('click', () => {
            closeSidebar();
        });
    });

    // Handle swipe to close (touch devices)
    let touchStartX = 0;
    let touchEndX = 0;

    sidebar.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sidebar.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            closeSidebar();
        }
    }, { passive: true });
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ===== Scroll Reveal Animations =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length === 0) return;



    // Scroll-reveal animation for fade-in elements
    const trigger = window.innerHeight * 0.92;
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < trigger) {
            el.classList.add('visible');
        }
    });
    window.addEventListener('scroll', () => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < trigger) {
                el.classList.add('visible');
            }
        });
    });
}

// ===== Contact Form Handling =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const subject = contactForm.querySelector('#subject');
            const message = contactForm.querySelector('#message');

            let isValid = true;

            // Reset previous errors
            contactForm.querySelectorAll('.form-control').forEach(input => {
                input.style.borderColor = '';
            });

            if (!name.value.trim()) {
                name.style.borderColor = 'var(--color-error)';
                isValid = false;
            }

            if (!email.value.trim() || !isValidEmail(email.value)) {
                email.style.borderColor = 'var(--color-error)';
                isValid = false;
            }

            if (!subject.value) {
                subject.style.borderColor = 'var(--color-error)';
                isValid = false;
            }

            if (!message.value.trim()) {
                message.style.borderColor = 'var(--color-error)';
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('.btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending...';
                submitBtn.disabled = true;

                // Prepare data
                const formData = {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: contactForm.querySelector('#phone').value.trim(),
                    subject: subject.value,
                    message: message.value.trim()
                };

                // Send to Google Sheets
                // Using 'no-cors' mode because Google Apps Script redirects to a different domain
                // which causes CORS issues in browser. 'no-cors' allows the request to go through
                // but we won't get a readable response content, which is fine for this use case.
                fetch('https://script.google.com/macros/s/AKfycbyaoiVMgMq9Ph5mMQe_DBOboz1zmUB9412VKdbgzeCKZEO7eqNrteCNqlfOTRMwyES7pQ/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                    .then(() => {
                        // Show success message
                        submitBtn.innerHTML = '✓ Message Sent!';
                        submitBtn.style.background = 'var(--color-success)';

                        // Reset form
                        contactForm.reset();

                        // Reset button after delay
                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.background = '';
                            submitBtn.disabled = false;
                        }, 5000);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        submitBtn.innerHTML = 'Error! Try Again';
                        submitBtn.style.background = 'var(--color-error)';

                        setTimeout(() => {
                            submitBtn.innerHTML = originalText;
                            submitBtn.style.background = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    });
            }
        });
    }
}

// ===== Helper Functions =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
