/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      menuToggle = document.getElementById('menu-icon'),
      menuClose = document.getElementById('menu-close')

/* Menu show */
if(menuToggle){
    menuToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu');
        menuClose.classList.add('show-close');
        menuToggle.classList.add('hide-menu-icon');
    })
}

/* Menu hidden */
if(menuClose){
    menuClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu');
        menuToggle.classList.remove('hide-menu-icon');
        menuClose.classList.remove('show-close');
    })
}

/*=============== ScrollSmoother ===============*/
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Only enable ScrollSmoother on desktop
ScrollTrigger.matchMedia({
  "(min-width: 1150px)": function() {
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      effects: true,
      normalizeScroll: false,
    });
  }
});

// Quote images animation with different triggers for mobile/desktop
ScrollTrigger.matchMedia({  
  // Desktop screens
  "(min-width: 1150px)": function() {
    gsap.from(".quote__images img", {
      scrollTrigger: {
        trigger: ".quote__images",
        start: "top 130%",
        toggleActions: "play none none reverse",
      },
      x: (i) => (i % 2 === 0 ? 200 : -200),
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.3,
    });
  }
});

// Continuous horizontal scroll (desktop only)
ScrollTrigger.matchMedia({
  // Desktop screens
  "(min-width: 1150px)": function() {
    gsap.to(".gallery__images", {
      xPercent: -100, // move left
      ease: "none",
      duration: 5, // slower = longer loop
      repeat: -1, // infinite
    });
  },

  // Mobile screens
  "(max-width: 1149px)": function() {
    // No horizontal animation on mobile
    gsap.set(".gallery__images", { xPercent: 0 });
  }
});
