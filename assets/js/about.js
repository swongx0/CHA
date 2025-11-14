// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Initialize smooth scrolling
const smoother = ScrollSmoother.create({
  smooth: 1.5,
  effects: true,
  smoothTouch: 0.1,
});

// Menu toggle functionality
const menuIcon = document.getElementById('menu-icon');
const menuClose = document.getElementById('menu-close');
const navMenu = document.getElementById('nav-menu');

if (menuIcon) {
  menuIcon.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

if (menuClose) {
  menuClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

// Close menu when clicking nav links
document.querySelectorAll('.nav__list-item-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
});

// Parallax effects for sections
gsap.utils.toArray('.about__who-are-we, .about__our-story, .about__our-team').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1,
    }
  });
});



// Horizontal scroll for Our Space gallery
const gallery = document.querySelector('.our-space__gallery');
const gallerySection = document.querySelector('.about__our-space');

if (gallery && gallerySection) {
  // Calculate how far to scroll horizontally
  const galleryWidth = gallery.scrollWidth;
  const viewportWidth = window.innerWidth;
  const scrollDistance = galleryWidth - viewportWidth;

  // Create horizontal scroll animation
  // Scrolling down moves gallery to the left (negative x)
  // Scrolling up moves gallery to the right (positive x / back to 0)
  gsap.to(gallery, {
    x: -scrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: gallerySection,
      start: 'top top',
      end: () => `+=${scrollDistance + viewportWidth}`,
      scrub: true,
      duration: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });
}

// Parallax effect for images
gsap.utils.toArray('.our-story__img').forEach(img => {
  gsap.to(img, {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: img,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });
});

// Interactive hotspots for Who Are We section
const hotspots = document.querySelectorAll('.hotspot');
const hoverPreview = document.querySelector('.hover-preview');

// Only initialize if elements exist
if (hotspots.length > 0 && hoverPreview) {
  hotspots.forEach(hotspot => {
    // Pulse animation for hotspot dots
    gsap.to(hotspot, {
      scale: 1.2,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    hotspot.addEventListener('mouseenter', (e) => {
      const mediaType = hotspot.dataset.mediaType;
      const mediaSrc = hotspot.dataset.mediaSrc;
      const mediaTitle = hotspot.dataset.mediaTitle;

      // Clear previous content
      hoverPreview.innerHTML = '';

      // Create title
      if (mediaTitle) {
        const title = document.createElement('div');
        title.textContent = mediaTitle;
        title.style.padding = '0.5rem 1rem';
        title.style.background = 'rgba(0, 0, 0, 0.8)';
        title.style.color = 'white';
        title.style.fontSize = '0.9rem';
        title.style.fontWeight = 'bold';
        title.style.borderRadius = '0.5rem 0.5rem 0 0';
        hoverPreview.appendChild(title);
      }

      // Create media container
      const mediaContainer = document.createElement('div');
      mediaContainer.style.overflow = 'hidden';
      mediaContainer.style.borderRadius = mediaTitle ? '0 0 0.5rem 0.5rem' : '0.5rem';

      // Create media element
      if (mediaType === 'image' || mediaType === 'gif') {
        const img = document.createElement('img');
        img.src = mediaSrc;
        img.alt = mediaTitle;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        mediaContainer.appendChild(img);
      } else if (mediaType === 'video') {
        const video = document.createElement('video');
        video.src = mediaSrc;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = 'auto';
        video.style.display = 'block';
        mediaContainer.appendChild(video);
      }

      hoverPreview.appendChild(mediaContainer);

      // Show preview with animation
      hoverPreview.style.display = 'block';
      gsap.fromTo(hoverPreview, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    });

    hotspot.addEventListener('mousemove', (e) => {
      // Position preview near cursor with offset
      const offsetX = 10;
      const offsetY = 10;
      
      let x = e.clientX + offsetX;
      let y = e.clientY + offsetY;

      // Keep preview within viewport
      const previewRect = hoverPreview.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (x + previewRect.width > viewportWidth) {
        x = e.clientX - previewRect.width - offsetX;
      }
      if (y + previewRect.height > viewportHeight) {
        y = e.clientY - previewRect.height - offsetY;
      }

      hoverPreview.style.left = `${x}px`;
      hoverPreview.style.top = `${y}px`;
    });

    hotspot.addEventListener('mouseleave', () => {
      gsap.to(hoverPreview, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
          hoverPreview.style.display = 'none';
          // Stop any playing videos
          const videos = hoverPreview.querySelectorAll('video');
          videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
          });
        }
      });
    });
  });
}

// Team gallery fade in animation
gsap.from('.our-team__gallery > div', {
  opacity: 0,
  y: 50,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: '.our-team__gallery',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1,
  }
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});