// Kumaon Drive Interactive Logic & Enhancements

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navigation on Scroll
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Smooth Anchor Scrolling & Pre-fill form on Destination / Service click
  const planButtons = document.querySelectorAll('[data-destination], [data-service]');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dest = btn.getAttribute('data-destination');
      const service = btn.getAttribute('data-service');
      const destInput = document.getElementById('destination');
      const serviceInput = document.getElementById('service');

      if (dest && destInput) {
        destInput.value = dest;
      }
      if (service && serviceInput) {
        serviceInput.value = service;
      }
    });
  });

  // 4. Contact / Booking Form Submission Simulation
  const form = document.getElementById('enquiry-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    // Set default minimum date to today
    const dateInput = document.getElementById('travel-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      
      submitBtn.innerHTML = `<span>Sending Request...</span>`;
      submitBtn.disabled = true;

      // Extract form data
      const formData = new FormData(form);
      const name = document.getElementById('name')?.value || 'Valued Guest';
      const phone = document.getElementById('phone')?.value || '';

      try {
        const response = await fetch('https://formsubmit.co/ajax/info@kumaondrive.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
          submitBtn.innerHTML = `<span>Request Sent ✓</span>`;
          submitBtn.style.backgroundColor = '#166534';
          
          if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `<strong>Thank you, ${name}!</strong> Your journey request has been sent to <strong>info@kumaondrive.com</strong>. Our team will contact you at <strong>${phone}</strong> shortly to confirm your booking details.`;
            formStatus.style.display = 'block';
          }

          form.reset();
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (err) {
        // Fallback: If fetch encounters cross-origin or network restriction, standard form submission takes over
        console.warn('AJAX submission failed, falling back to standard submission...', err);
        form.submit();
        return;
      }

      setTimeout(() => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
      }, 7000);
    });
  }

  // 5. Intersection Observer for Subtle Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.service-card, .why-card, .destination-card, .fleet-card, .split-grid, .experience-grid'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
