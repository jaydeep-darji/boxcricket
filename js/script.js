// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuOpenBtn = document.getElementById('menu-open-button');
    const menuCloseBtn = document.getElementById('menu-close-button');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Open menu
    menuOpenBtn.addEventListener('click', function() {
        navMenu.classList.add('active');
    });

    // Close menu
    menuCloseBtn.addEventListener('click', function() {
        navMenu.classList.remove('active');
    });

    // Close menu when clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-menu') && !event.target.closest('#menu-open-button')) {
            navMenu.classList.remove('active');
        }
    });
});