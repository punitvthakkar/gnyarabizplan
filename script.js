// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.content-section');
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initNavigation();
    initScrollAnimations();
    initFinancialChart();
});

// Theme Functionality
function initTheme() {
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = savedTheme;
    updateThemeIcon();

    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light-mode' ? 'dark-mode' : 'light-mode';
    
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDarkMode = document.body.className === 'dark-mode';
    themeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
}

// Mobile Menu Functionality
function initMenu() {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ?
            '<i class="fas fa-times"></i>' :
            '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && e.target !== menuToggle) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close menu when clicking on a nav link on mobile
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// Smooth Scrolling and Navigation Highlighting
function initNavigation() {
    // Add smooth scrolling to all nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active nav link on scroll
    window.addEventListener('scroll', debounce(highlightNavLink, 100));
    
    // Initial highlight
    highlightNavLink();
}

function highlightNavLink() {
    let scrollPosition = window.scrollY + 100;
    
    // Get all sections and find the one currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    // Initial check for visible elements
    checkForVisibleElements();
    
    // Check for new visible elements on scroll
    window.addEventListener('scroll', debounce(checkForVisibleElements, 50));
}

function checkForVisibleElements() {
    const triggerHeight = window.innerHeight * 0.85;
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerHeight) {
            element.classList.add('visible');
        }
    });
}

// Create Financial Chart
function initFinancialChart() {
    const ctx = document.getElementById('financial-chart');
    
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Month 3', 'Month 6', 'Month 9', 'Month 12', 'Year 2', 'Year 3'],
            datasets: [{
                label: 'Monthly Recurring Revenue ($K)',
                data: [0, 15, 45, 75, 180, 350],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgba(99, 102, 241, 1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($K)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Timeline'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `$${context.parsed.y}K MRR`
                    }
                }
            }
        }
    });
}

// Add classes to elements for animations
function addAnimationClasses() {
    // Add animation classes to sections
    sections.forEach((section, index) => {
        const sectionContent = section.querySelector('.section-content');
        
        if (index % 2 === 0) {
            sectionContent.classList.add('slide-in-left');
        } else {
            sectionContent.classList.add('slide-in-right');
        }
    });
    
    // Add fade-in animations to cards and items
    const cards = document.querySelectorAll('.process-item, .metric, .feature, .moat-item, .funding-round');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.classList.add(`delay-${(index % 5) + 1}`);
    });
}

// Initialize animations after DOM is fully loaded
window.addEventListener('load', addAnimationClasses);

// Utility Functions
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
