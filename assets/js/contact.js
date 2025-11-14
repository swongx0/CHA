gsap.registerPlugin(ScrollTrigger);

// Mobile menu functionality
const menuIcon = document.getElementById('menu-icon');
const menuClose = document.getElementById('menu-close');
const navMenu = document.getElementById('nav-menu');

if (menuIcon) {
  menuIcon.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
    menuClose.classList.add('show-close');
    menuIcon.classList.add('hide-menu-icon');
  });
}

if (menuClose) {
  menuClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
    menuClose.classList.remove('show-close');
    menuIcon.classList.remove('hide-menu-icon');
  });
}

// 3D Parallax Scroll Effect
document.addEventListener('DOMContentLoaded', () => {
  // Add 3D perspective to body
  gsap.set('body', {
    perspective: 1000,
    transformStyle: 'preserve-3d'
  });

  // Parallax effect for contact info box (mid layer - medium speed)
  gsap.to('.contact__info', {
    scrollTrigger: {
      trigger: '.contact__container',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: -100,
    rotateX: 5,
    rotateY: -3,
    z: 50,
    ease: 'none'
  });

  // Parallax effect for contact image (foreground layer - faster)
  gsap.to('.contact__image', {
    scrollTrigger: {
      trigger: '.contact__container',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    },
    y: -150,
    rotateX: -3,
    rotateY: 5,
    scale: 0.95,
    z: 100,
    ease: 'none'
  });

  // Entrance animations with 3D effect
  gsap.from('.contact__info', {
    scrollTrigger: {
      trigger: '.contact__info',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    duration: 1,
    x: 100,
    opacity: 0,
    rotateY: 15,
    z: -100,
    ease: 'power3.out',
    delay: 0.2
  });

  gsap.from('.contact__image', {
    scrollTrigger: {
      trigger: '.contact__image',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    duration: 1,
    x: -100,
    opacity: 0,
    rotateY: -15,
    z: -100,
    ease: 'power3.out',
    delay: 0.4
  });
});
