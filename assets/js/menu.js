gsap.registerPlugin(ScrollTrigger);

class MenuScrollController {
  constructor() {
    this.contents = document.querySelectorAll('.menu__content');
    this.items = document.querySelectorAll('.menu__option-item');
    this.currentContent = 0;
    this.isAnimating = false;
    this.animationDuration = 300;
    this.scrollThreshold = 50;
    this.lastScrollTime = 0;
    this.scrollCooldown = 600;
    
    // Only initialize on desktop
    if (window.innerWidth >= 1150) {
      this.init();
    }
    
    // Re-initialize on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1150 && !this.initialized) {
        this.init();
      } else if (window.innerWidth < 1150 && this.initialized) {
        this.destroy();
      }
    });
  }
  
  init() {
    this.initialized = true;
    
    // Show first content immediately
    this.showContent(0);
    
    // Set up scroll listeners
    this.setupScrollListeners();
    
    // Disable default scrolling behavior only for menu section
    this.disableMenuScroll();
  }
  
  destroy() {
    this.initialized = false;
    this.removeScrollListeners();
    this.enableMenuScroll();
  }
  
  setupScrollListeners() {
    let accumulatedDelta = 0;
    
    this.wheelHandler = (e) => {
      // Only handle scroll when over the menu container
      const menuContainer = document.querySelector('.menu__container');
      if (!menuContainer.contains(e.target)) return;
      
      e.preventDefault();
      
      const now = Date.now();
      if (now - this.lastScrollTime < this.scrollCooldown || this.isAnimating) {
        return;
      }
      
      accumulatedDelta += e.deltaY;
      
      if (Math.abs(accumulatedDelta) > this.scrollThreshold) {
        if (accumulatedDelta > 0) {
          this.nextContent();
        } else {
          this.previousContent();
        }
        
        accumulatedDelta = 0;
        this.lastScrollTime = now;
      }
    };
    
    // Touch events for mobile
    let touchStartY = 0;
    
    this.touchStartHandler = (e) => {
      const menuContainer = document.querySelector('.menu__container');
      if (!menuContainer.contains(e.target)) return;
      
      touchStartY = e.changedTouches[0].screenY;
    };
    
    this.touchEndHandler = (e) => {
      const menuContainer = document.querySelector('.menu__container');
      if (!menuContainer.contains(e.target)) return;
      
      const now = Date.now();
      if (now - this.lastScrollTime < this.scrollCooldown || this.isAnimating) {
        return;
      }
      
      const touchEndY = e.changedTouches[0].screenY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > this.scrollThreshold) {
        if (deltaY > 0) {
          this.nextContent();
        } else {
          this.previousContent();
        }
        
        this.lastScrollTime = now;
      }
    };
    
    // Keyboard navigation
    this.keyHandler = (e) => {
      const now = Date.now();
      if (now - this.lastScrollTime < this.scrollCooldown || this.isAnimating) {
        return;
      }
      
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        this.nextContent();
        this.lastScrollTime = now;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.previousContent();
        this.lastScrollTime = now;
      }
    };
    
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
    window.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    window.addEventListener('touchend', this.touchEndHandler, { passive: true });
    window.addEventListener('keydown', this.keyHandler);
  }
  
  removeScrollListeners() {
    if (this.wheelHandler) {
      window.removeEventListener('wheel', this.wheelHandler);
    }
    if (this.touchStartHandler) {
      window.removeEventListener('touchstart', this.touchStartHandler);
    }
    if (this.touchEndHandler) {
      window.removeEventListener('touchend', this.touchEndHandler);
    }
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }
  }
  
  disableMenuScroll() {
    // Only disable scroll for the menu container area
    const menuContainer = document.querySelector('.menu__container');
    if (menuContainer) {
      menuContainer.style.overflow = 'hidden';
    }
  }
  
  enableMenuScroll() {
    const menuContainer = document.querySelector('.menu__container');
    if (menuContainer) {
      menuContainer.style.overflow = 'visible';
    }
  }
  
  showContent(index) {
    if (index >= this.contents.length || index < 0) return;
    
    // Hide all contents
    this.contents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show target content
    this.contents[index].classList.add('active');
  }

  showItem(index) {
    if (index >= this.items.length || index < 0) return;
    
    // Hide all items
    this.items.forEach(item => {
      item.classList.remove('active');
    });
    
    // Show target item
    this.items[index].classList.add('active');
  }
  
  nextContent() {
    if (this.isAnimating || this.currentContent >= this.contents.length - 1) {
      return;
    }
    
    this.isAnimating = true;
    const nextIndex = this.currentContent + 1;
    
    // Fade out current content
    gsap.to(this.contents[this.currentContent], {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        this.contents[this.currentContent].classList.remove('active');
      }
    });
    
    // Slide up current image completely out of frame
    gsap.to(this.items[this.currentContent], {
      y: '-100vh',
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        this.items[this.currentContent].classList.remove('active');
        
        // Prepare next content and image from below
        this.contents[nextIndex].classList.add('active');
        this.items[nextIndex].classList.add('active');
        
        gsap.set(this.contents[nextIndex], { opacity: 0 });
        gsap.set(this.items[nextIndex], { y: '100vh' });
        
        // Fade in next content
        gsap.to(this.contents[nextIndex], {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut'
        });
        
        // Slide in next image from below
        gsap.to(this.items[nextIndex], {
          y: 0,
          duration: 0.9,
          ease: 'power2.inOut',
          onComplete: () => {
            this.currentContent = nextIndex;
            this.isAnimating = false;
          }
        });
      }
    });
  }
  
  previousContent() {
    if (this.isAnimating || this.currentContent <= 0) {
      return;
    }
    
    this.isAnimating = true;
    const prevIndex = this.currentContent - 1;
    
    // Fade out current content
    gsap.to(this.contents[this.currentContent], {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        this.contents[this.currentContent].classList.remove('active');
      }
    });
    
    // Slide down current image completely out of frame
    gsap.to(this.items[this.currentContent], {
      y: '100vh',
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        this.items[this.currentContent].classList.remove('active');
        
        // Prepare previous content and image from above
        this.contents[prevIndex].classList.add('active');
        this.items[prevIndex].classList.add('active');
        
        gsap.set(this.contents[prevIndex], { opacity: 0 });
        gsap.set(this.items[prevIndex], { y: '-100vh' });
        
        // Fade in previous content
        gsap.to(this.contents[prevIndex], {
          opacity: 1,
          duration: 0.9,
          ease: 'power2.inOut'
        });
        
        // Slide in previous image from above
        gsap.to(this.items[prevIndex], {
          y: 0,
          duration: 0.9,
          ease: 'power2.inOut',
          onComplete: () => {
            this.currentContent = prevIndex;
            this.isAnimating = false;
          }
        });
      }
    });
  }
}

// Initialize menu scroll controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MenuScrollController();
});
