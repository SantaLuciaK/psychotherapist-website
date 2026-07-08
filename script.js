document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STICKY HEADER & SCROLL EFFECT
  // ==========================================================================
  const header = document.getElementById('header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check in case of page reload halfway down

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    if (navMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    menuToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Triggers when section occupies mid screen
    threshold: 0
  };

  const observerCallback = (entries) => {
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
  };

  const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================================================
  // DYNAMIC FORMAT SELECTOR
  // ==========================================================================
  const formatButtons = document.querySelectorAll('.select-format-btn');
  const formatDropdown = document.getElementById('consult-format');

  formatButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedFormat = btn.getAttribute('data-format');
      if (selectedFormat && formatDropdown) {
        // Find option that contains the format text
        for (let option of formatDropdown.options) {
          if (option.value.includes(selectedFormat)) {
            formatDropdown.value = option.value;
            break;
          }
        }
      }
    });
  });

  // ==========================================================================
  // BOOKING FORM VALIDATION & SIMULATION
  // ==========================================================================
  const form = document.getElementById('consultation-form');
  if (form) {
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-button');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    const successName = document.getElementById('success-client-name');
    const successContact = document.getElementById('success-contact-method');
    const resetBtn = document.getElementById('reset-form-btn');

    // Input fields for real-time validation
    const fields = {
      name: {
        input: document.getElementById('user-name'),
        group: document.getElementById('user-name').parentElement,
        validate: (value) => value.trim().length >= 2
      },
      contact: {
        input: document.getElementById('user-contact'),
        group: document.getElementById('user-contact').parentElement,
        validate: (value) => value.trim().length >= 3
      },
      agreement: {
        input: document.getElementById('user-agreement'),
        group: document.getElementById('user-agreement').closest('.checkbox-group'),
        validate: (value, input) => input.checked
      }
    };

    // Helper to validate a specific field
    const validateField = (fieldName) => {
      const field = fields[fieldName];
      const isValid = field.validate(field.input.value, field.input);
      
      if (isValid) {
        field.group.classList.remove('has-error');
      } else {
        field.group.classList.add('has-error');
      }
      
      return isValid;
    };

    // Attach real-time validation listeners
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const eventType = field.input.type === 'checkbox' ? 'change' : 'input';
      field.input.addEventListener(eventType, () => validateField(key));
    });

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate all fields on submit
      let isFormValid = true;
      Object.keys(fields).forEach(key => {
        const isFieldValid = validateField(key);
        if (!isFieldValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // Simulate form submission
        submitForm();
      } else {
        // Focus on the first invalid field
        const firstError = document.querySelector('.has-error input');
        if (firstError) firstError.focus();
      }
    });

    const submitForm = () => {
      // Disable inputs and show loading state
      submitBtn.disabled = true;
      btnText.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
      
      const inputs = form.querySelectorAll('input, select, textarea, button');
      inputs.forEach(input => input.disabled = true);

      // Form data for simulation
      const nameVal = fields.name.input.value;
      const contactMethodOption = form.querySelector('input[name="contact-method"]:checked');
      const contactMethod = contactMethodOption ? contactMethodOption.value : 'Telegram';

      // Simulate server call
      setTimeout(() => {
        // Hide form, show success state
        form.classList.add('hidden');
        formSuccess.classList.remove('hidden');
        
        // Populate success page templates
        successName.textContent = nameVal;
        successContact.textContent = contactMethod;
        
        // Scroll to booking section to make success message visible
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      }, 1500);
    };

    // Reset form to send another request
    resetBtn.addEventListener('click', () => {
      form.reset();
      
      // Re-enable inputs
      const inputs = form.querySelectorAll('input, select, textarea, button');
      inputs.forEach(input => input.disabled = false);
      
      // Restore button state
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      
      // Toggle displays
      formSuccess.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS (INTEGRATION OBSERVER)
  // ==========================================================================
  // We will programmatically add .reveal class to items for modern entrance effects
  const elementsToReveal = [
    '.section-header',
    '.hero-content > *',
    '.hero-image-wrapper',
    '.about-story-block',
    '.about-story-divider-img',
    '.issue-card',
    '.crossroads-grid > *',
    '.booking-combined-grid > *'
  ];

  // Apply reveal class and setup observer
  const revealElements = [];
  elementsToReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      revealElements.push(el);
    });
  });

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before element enters viewport
    threshold: 0.05
  };

  const revealObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop observing to keep animation static
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
  revealElements.forEach(el => revealObserver.observe(el));
});
