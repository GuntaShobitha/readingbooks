/* ============================================
   INKWELL & SPINE — Main Interactions
   Includes: scroll effects, mobile menu,
   reveal animations, FAQ, chips, social links,
   form validation, book filtering
   ============================================ */

(function () {
  'use strict';

  /* ----- Utility Helpers ----- */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ----- Nav Scroll ----- */
  var nav = $('.nav');
  if (nav) {
    function onNavScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();
  }

  /* ----- Mobile Hamburger Menu ----- */
  var burger = $('.hamburger');
  var navLinks = $('.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      navLinks.classList.toggle('mobile-open');
      burger.setAttribute('aria-expanded', navLinks.classList.contains('mobile-open') ? 'true' : 'false');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        burger.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----- Reveal on Scroll (Intersection Observer) ----- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal, .reveal-stagger').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ----- FAQ Accordion ----- */
  $$('.faq-item').forEach(function (item) {
    item.addEventListener('click', function () {
      item.classList.toggle('open');
      // Announce for screen readers
      var answer = item.querySelector('.faq-a');
      if (answer) {
        answer.setAttribute('aria-hidden', !item.classList.contains('open'));
      }
    });

    // Keyboard support
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', function () {
      item.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    });
  });

  /* ----- Chips / Filter Buttons ----- */
  var chips = $$('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');

      // Book filtering on books.html
      var filter = chip.getAttribute('data-filter');
      if (filter) {
        var books = $$('.book-card');
        books.forEach(function (book) {
          var categories = book.getAttribute('data-category') || '';
          if (filter === 'all' || categories.indexOf(filter) !== -1) {
            book.style.display = '';
          } else {
            book.style.display = 'none';
          }
        });
      }
    });
  });

  /* ----- Social Icons -> 404 ----- */
  $$('[data-social]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = './404.html';
    });
  });

  /* ----- Mock Form Submissions (Newsletter, Contact) ----- */
  $$('form[data-mock]').forEach(function (form) {
    var handler = function (e) {
      e.preventDefault();

      // Simple validation
      var emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        var originalText = btn.textContent;
        btn.textContent = '✓ Sent';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
        }, 2200);
      }
    };
    form.addEventListener('submit', handler);
  });

  /* ----- Form Validation Utility ----- */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    var errorEl = field.querySelector('.error-text');
    field.classList.add('has-error');
    field.classList.remove('success');
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(input) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    var errorEl = field.querySelector('.error-text');
    if (errorEl) errorEl.textContent = '';
  }

  function showFieldSuccess(input) {
    var field = input.closest('.field');
    if (!field) return;
    field.classList.remove('has-error');
    field.classList.add('success');
  }

  function showFormMessage(form, type, message) {
    var msgEl = form.querySelector('.auth-message');
    if (!msgEl) {
      var div = document.createElement('div');
      div.className = 'auth-message ' + type;
      div.textContent = message;
      form.insertBefore(div, form.firstChild);
      setTimeout(function () { div.classList.add('show'); }, 10);
      setTimeout(function () { if (div.parentNode) div.parentNode.removeChild(div); }, 4000);
      return;
    }
    msgEl.className = 'auth-message ' + type + ' show';
    msgEl.textContent = message;
    setTimeout(function () {
      msgEl.classList.remove('show');
    }, 4000);
  }

  /* ----- Contact Form Validation ----- */
  var contactForm = $('.contact-form');
  if (contactForm && !contactForm.hasAttribute('data-mock')) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll('input, textarea').forEach(function (input) {
        clearFieldError(input);
        if (!input.value.trim()) {
          showFieldError(input, 'This field is required.');
          valid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          showFieldError(input, 'Please enter a valid email.');
          valid = false;
        } else {
          showFieldSuccess(input);
        }
      });

      if (valid) {
        var btn = contactForm.querySelector('button[type="submit"]');
        if (btn) {
          var t = btn.textContent;
          btn.textContent = '✓ Sent';
          btn.disabled = true;
          setTimeout(function () {
            btn.textContent = t;
            btn.disabled = false;
            contactForm.reset();
            contactForm.querySelectorAll('input, textarea').forEach(clearFieldError);
            contactForm.querySelectorAll('.field.success').forEach(function (f) { f.classList.remove('success'); });
          }, 2200);
        }
      }
    });

    // Real-time validation clearing
    contactForm.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.value.trim()) {
          clearFieldError(input);
          showFieldSuccess(input);
        } else {
          clearFieldError(input);
        }
      });
    });
  }

  /* ----- Book Page: "Add to basket" buttons ----- */
  $$('.book-card .btn-primary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var original = btn.textContent;
      btn.textContent = '✓ Added';
      btn.style.background = '#2a8a3e';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
      }, 1500);
    });
  });

  /* ----- Profile & Settings Form Submissions ----- */
  var profileForm = document.getElementById('profile-edit-form') || document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      profileForm.querySelectorAll('input[required]').forEach(function (input) {
        clearFieldError(input);
        if (!input.value.trim()) {
          showFieldError(input, 'This field is required.');
          valid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          showFieldError(input, 'Please enter a valid email.');
          valid = false;
        }
      });

      if (valid) {
        showFormMessage(profileForm, 'success', 'Profile updated successfully!');
      }
    });

    profileForm.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.value.trim()) {
          clearFieldError(input);
        }
      });
    });
  }

  /* ----- Settings Form ----- */
  var settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showFormMessage(settingsForm, 'success', 'Settings saved successfully!');
    });
  }

  /* ----- Profile Page Logout ----- */
  var pageLogoutBtn = document.getElementById('page-logout-btn');
  if (pageLogoutBtn) {
    pageLogoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('inkwell_role');
      localStorage.removeItem('inkwell_email');
      localStorage.removeItem('inkwell_name');
      window.location.href = './index.html';
    });
  }

  /* ----- Page-specific: Set active nav link ----- */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || href === './' + currentPage) {
      link.classList.add('active');
    }
  });

  /* ----- 404 Redirect for broken internal links ----- */
  document.addEventListener('click', function (e) {
    var target = e.target.closest('a');
    if (!target) return;
    var href = target.getAttribute('href');
    if (!href || href === '#' || href.startsWith('http') || href.startsWith('javascript') || href.startsWith('tel') || href.startsWith('mailto')) return;
    // Only check relative links
    if (href.startsWith('./') || href.startsWith('../') || !href.includes('/')) {
      // If the link points to an html page that doesn't exist
      if (href.endsWith('.html') && !href.includes('#')) {
        // We let the browser handle it naturally, which will show 404 if missing
      }
    }
  });

})();
